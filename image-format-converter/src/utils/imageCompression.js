/**
 * Compress a single image file
 * @param {File} file - Original image file
 * @param {Object} options - Compression options
 * @returns {Promise<Object>} Compressed image data with metadata
 */
import { extractImagesFromPDF } from './pdfConverter';

/**
 * Compress a single image file
 * @param {File} file - Original image file
 * @param {Object} options - Compression options
 * @returns {Promise<Object>} Compressed image data with metadata
 */
export async function compressImage(file, options = {}) {
    // Check if file is PDF
    // Check if file is PDF
    if (file.type === 'application/pdf') {
        try {
            // Extract images from PDF with lower scale for better compression
            // Use scale 1.0 to avoid upscaling which increases file size
            const images = await extractImagesFromPDF(file, { scale: 1.0 });

            if (images.length === 0) {
                throw new Error('No images found in PDF');
            }

            // Compress first page/image
            const firstImage = images[0];

            // Calculate dimensions with resizing if needed
            let width = firstImage.width;
            let height = firstImage.height;
            const { maxWidth, maxHeight } = options;

            if (maxWidth && width > maxWidth) {
                height = (height * maxWidth) / width;
                width = maxWidth;
            }

            if (maxHeight && height > maxHeight) {
                width = (width * maxHeight) / height;
                height = maxHeight;
            }

            const canvas = document.createElement('canvas');
            canvas.width = width;
            canvas.height = height;

            const ctx = canvas.getContext('2d');

            // Enable image smoothing
            ctx.imageSmoothingEnabled = true;
            ctx.imageSmoothingQuality = 'high';

            const img = new Image();
            img.src = URL.createObjectURL(firstImage.blob);

            await new Promise((resolve) => {
                img.onload = () => {
                    ctx.drawImage(img, 0, 0, width, height);
                    resolve();
                };
            });

            // Convert to compressed blob
            const compressedBlob = await new Promise((resolve) => {
                canvas.toBlob(
                    (blob) => resolve(blob),
                    `image/${options.outputFormat || 'jpeg'}`,
                    options.quality || 0.8
                );
            });

            return {
                blob: compressedBlob,
                file: new File([compressedBlob], file.name.replace('.pdf', '.jpg'), {
                    type: 'image/jpeg',
                }),
                metadata: {
                    originalSize: file.size,
                    compressedSize: compressedBlob.size,
                    compressionRatio: ((file.size - compressedBlob.size) / file.size) * 100,
                    originalDimensions: { width: firstImage.width, height: firstImage.height },
                    newDimensions: { width, height },
                    quality: options.quality || 0.8,
                    format: options.outputFormat || 'jpeg',
                    sourcePDF: true,
                    pdfPages: images.length,
                },
            };
        } catch (error) {
            console.error('Error compressing PDF:', error);
            throw error;
        }
    }

    const {
        quality = 0.8,          // 0-1 (80% default)
        maxWidth = null,        // Max width (null = no limit)
        maxHeight = null,       // Max height (null = no limit)
        outputFormat = 'jpeg',  // 'jpeg', 'png', 'webp'
        preserveExif = false,   // Preserve EXIF data
    } = options;

    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = (e) => {
            const img = new Image();

            img.onload = () => {
                try {
                    // Calculate dimensions
                    let { width, height } = img;

                    if (maxWidth && width > maxWidth) {
                        height = (height * maxWidth) / width;
                        width = maxWidth;
                    }

                    if (maxHeight && height > maxHeight) {
                        width = (width * maxHeight) / height;
                        height = maxHeight;
                    }

                    // Create canvas
                    const canvas = document.createElement('canvas');
                    canvas.width = width;
                    canvas.height = height;

                    const ctx = canvas.getContext('2d');

                    // Enable image smoothing for better quality
                    ctx.imageSmoothingEnabled = true;
                    ctx.imageSmoothingQuality = 'high';

                    // Draw image
                    ctx.drawImage(img, 0, 0, width, height);

                    // Convert to blob
                    canvas.toBlob(
                        (blob) => {
                            if (!blob) {
                                reject(new Error('Compression failed'));
                                return;
                            }

                            // Calculate compression ratio
                            const originalSize = file.size;
                            const compressedSize = blob.size;
                            const ratio = ((originalSize - compressedSize) / originalSize) * 100;

                            resolve({
                                blob,
                                file: new File([blob], file.name, { type: blob.type }),
                                metadata: {
                                    originalSize,
                                    compressedSize,
                                    compressionRatio: ratio,
                                    originalDimensions: { width: img.width, height: img.height },
                                    newDimensions: { width, height },
                                    quality,
                                    format: outputFormat,
                                },
                            });
                        },
                        `image/${outputFormat}`,
                        quality
                    );
                } catch (error) {
                    reject(error);
                }
            };

            img.onerror = () => reject(new Error('Failed to load image'));
            img.src = e.target.result;
        };

        reader.onerror = () => reject(new Error('Failed to read file'));
        reader.readAsDataURL(file);
    });
}

/**
 * Compress multiple images in batch
 * @param {File[]} files - Array of image files
 * @param {Object} options - Compression options
 * @param {Function} onProgress - Progress callback
 * @returns {Promise<Object[]>} Array of compressed images
 */
export async function compressBatch(files, options = {}, onProgress = null) {
    const results = [];
    const total = files.length;

    for (let i = 0; i < files.length; i++) {
        try {
            const result = await compressImage(files[i], options);
            results.push({ success: true, data: result, originalFile: files[i] });

            if (onProgress) {
                onProgress({
                    current: i + 1,
                    total,
                    percentage: ((i + 1) / total) * 100,
                    currentFile: files[i].name,
                });
            }
        } catch (error) {
            results.push({ success: false, error: error.message, originalFile: files[i] });
        }
    }

    return results;
}

/**
 * Estimate compressed file size
 * @param {File} file - Original file
 * @param {number} quality - Quality (0-1)
 * @returns {number} Estimated size in bytes
 */
export function estimateCompressedSize(file, quality) {
    // Rough estimation based on quality
    const baseReduction = 1 - quality;
    return Math.floor(file.size * (1 - baseReduction * 0.7));
}

/**
 * Format file size to human-readable string
 * @param {number} bytes - Size in bytes
 * @returns {string} Formatted size
 */
export function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
}

/**
 * Calculate savings percentage
 * @param {number} originalSize - Original file size
 * @param {number} compressedSize - Compressed file size
 * @returns {number} Percentage saved
 */
export function calculateSavings(originalSize, compressedSize) {
    if (originalSize === 0) return 0;
    return Math.round(((originalSize - compressedSize) / originalSize) * 100);
}
