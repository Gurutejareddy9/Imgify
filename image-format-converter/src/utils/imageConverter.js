/**
 * Image Converter Utility
 * Handles client-side image conversion using Canvas API
 */

import { imageToPDF, multipleImagesToPDF, extractImagesFromPDF } from './pdfConverter';

// Main conversion function
export async function convertImage(file, targetFormat, settings = {}) {
    try {
        // Check if source is PDF
        if (file.type === 'application/pdf') {
            if (targetFormat === 'pdf') {
                // PDF to PDF (just return original)
                return {
                    blob: file,
                    extension: 'pdf',
                    width: 0, // Unknown without parsing
                    height: 0,
                    size: file.size,
                    metadata: {
                        originalSize: file.size,
                        compressedSize: file.size,
                        compressionRatio: 0,
                        format: 'pdf',
                    },
                };
            } else {
                // PDF to Image - extract first page
                const images = await extractImagesFromPDF(file);
                if (images.length === 0) {
                    throw new Error('No images found in PDF');
                }

                // Return first page as image
                return {
                    blob: images[0].blob,
                    extension: targetFormat,
                    width: images[0].width,
                    height: images[0].height,
                    size: images[0].blob.size,
                    metadata: {
                        originalSize: file.size,
                        compressedSize: images[0].blob.size,
                        compressionRatio: ((file.size - images[0].blob.size) / file.size) * 100,
                        originalDimensions: { width: images[0].width, height: images[0].height },
                        newDimensions: { width: images[0].width, height: images[0].height },
                        format: targetFormat,
                        extractedFromPDF: true,
                        pdfPage: 1,
                    },
                };
            }
        }

        // Check if target is PDF
        if (targetFormat === 'pdf') {
            const pdfBlob = await imageToPDF(file, settings);

            return {
                blob: pdfBlob,
                extension: 'pdf',
                width: 0, // PDF doesn't have single pixel dimensions
                height: 0,
                size: pdfBlob.size,
                metadata: {
                    originalSize: file.size,
                    compressedSize: pdfBlob.size,
                    compressionRatio: 0,
                    format: 'pdf',
                    pageSize: settings.pageSize || 'a4',
                    orientation: settings.orientation || 'portrait',
                },
            };
        }

        const { canvas, ctx, width, height } = await loadImageToCanvas(file);
        let blob;
        let extension = targetFormat;

        switch (targetFormat.toLowerCase()) {
            case 'jpg':
            case 'jpeg':
                blob = await convertToJPG(canvas, settings);
                extension = 'jpg';
                break;
            case 'png':
                blob = await convertToPNG(canvas, settings);
                extension = 'png';
                break;
            case 'webp':
                blob = await convertToWEBP(canvas, settings);
                extension = 'webp';
                break;
            case 'gif':
                blob = await convertToGIF(canvas, settings);
                extension = 'gif';
                break;
            case 'bmp':
                blob = await convertToBMP(canvas, ctx, width, height, settings);
                extension = 'bmp';
                break;
            default:
                throw new Error(`Unsupported format: ${targetFormat}`);
        }

        return {
            blob,
            extension,
            width,
            height,
            size: blob.size
        };
    } catch (error) {
        console.error('Conversion failed:', error);
        throw error;
    }
}

// Add batch PDF conversion function:
export async function convertBatchToPDF(files, settings) {
    if (settings.multiPage) {
        // Create single multi-page PDF
        const pdfBlob = await multipleImagesToPDF(files, settings);

        return [{
            blob: pdfBlob,
            extension: 'pdf',
            filename: 'converted-images.pdf',
            size: pdfBlob.size,
            metadata: {
                originalSize: files.reduce((sum, f) => sum + f.size, 0),
                compressedSize: pdfBlob.size,
                format: 'pdf',
                pageCount: files.length,
                multiPage: true,
            },
        }];
    } else {
        // Create separate PDF for each image
        const results = [];
        for (const file of files) {
            const pdfBlob = await imageToPDF(file, settings);
            results.push({
                blob: pdfBlob,
                extension: 'pdf',
                filename: file.name.replace(/\.[^.]+$/, '.pdf'),
                size: pdfBlob.size,
                metadata: {
                    originalSize: file.size,
                    compressedSize: pdfBlob.size,
                    format: 'pdf',
                },
            });
        }
        return results;
    }
}

// Helper to load image
function loadImageToCanvas(file) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        const url = URL.createObjectURL(file);

        img.onload = () => {
            const canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0);
            URL.revokeObjectURL(url);
            resolve({ canvas, ctx, width: img.width, height: img.height });
        };

        img.onerror = () => {
            URL.revokeObjectURL(url);
            reject(new Error('Failed to load image'));
        };

        img.src = url;
    });
}

// Format Converters

async function convertToJPG(canvas, settings) {
    const quality = (settings.quality || 90) / 100;

    // If grayscale is requested
    if (settings.colorSpace === 'grayscale') {
        const ctx = canvas.getContext('2d');
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;
        for (let i = 0; i < data.length; i += 4) {
            const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
            data[i] = avg;
            data[i + 1] = avg;
            data[i + 2] = avg;
        }
        ctx.putImageData(imageData, 0, 0);
    }

    return new Promise(resolve => {
        canvas.toBlob(blob => resolve(blob), 'image/jpeg', quality);
    });
}

async function convertToPNG(canvas, settings) {
    return new Promise(resolve => {
        canvas.toBlob(blob => resolve(blob), 'image/png');
    });
}

async function convertToWEBP(canvas, settings) {
    const quality = (settings.quality || 85) / 100;
    return new Promise(resolve => {
        canvas.toBlob(blob => resolve(blob), 'image/webp', quality);
    });
}

async function convertToGIF(canvas, settings) {
    // Static GIF
    return new Promise(resolve => {
        canvas.toBlob(blob => resolve(blob), 'image/gif');
    });
}

async function convertToBMP(canvas, ctx, width, height, settings) {
    // Simple BMP encoder (24-bit)
    const imageData = ctx.getImageData(0, 0, width, height);
    const data = imageData.data;

    // BMP Header size: 14 bytes
    // DIB Header size: 40 bytes (BITMAPINFOHEADER)
    // Row size must be multiple of 4 bytes
    const rowSize = Math.floor((24 * width + 31) / 32) * 4;
    const fileSize = 54 + (rowSize * height);

    const buffer = new ArrayBuffer(fileSize);
    const view = new DataView(buffer);

    // BMP Header
    view.setUint16(0, 0x4D42, true); // BM (little endian)
    view.setUint32(2, fileSize, true);
    view.setUint32(6, 0, true); // Reserved
    view.setUint32(10, 54, true); // Offset

    // DIB Header
    view.setUint32(14, 40, true); // Header size
    view.setInt32(18, width, true);
    view.setInt32(22, -height, true); // Top-down (negative height)
    view.setUint16(26, 1, true); // Planes
    view.setUint16(28, 24, true); // Bit count (24-bit)
    view.setUint32(30, 0, true); // Compression (BI_RGB)
    view.setUint32(34, 0, true); // Image size (can be 0 for BI_RGB)
    view.setInt32(38, 0, true); // X ppm
    view.setInt32(42, 0, true); // Y ppm
    view.setUint32(46, 0, true); // Colors used
    view.setUint32(50, 0, true); // Important colors

    // Pixel Data
    let offset = 54;
    const padding = rowSize - (width * 3);

    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            const i = (y * width + x) * 4;
            // BMP uses BGR format
            view.setUint8(offset++, data[i + 2]); // B
            view.setUint8(offset++, data[i + 1]); // G
            view.setUint8(offset++, data[i]);     // R
        }
        // Add padding
        for (let p = 0; p < padding; p++) {
            view.setUint8(offset++, 0);
        }
    }

    return new Blob([buffer], { type: 'image/bmp' });
}

export function getImageMetadata(file) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        const url = URL.createObjectURL(file);
        img.onload = () => {
            resolve({
                width: img.width,
                height: img.height,
                name: file.name,
                size: file.size,
                type: file.type
            });
            URL.revokeObjectURL(url);
        };
        img.onerror = () => {
            URL.revokeObjectURL(url);
            reject(new Error('Invalid image file'));
        };
        img.src = url;
    });
}
