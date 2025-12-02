import jsPDF from 'jspdf';
import { PDFDocument } from 'pdf-lib';
import * as pdfjsLib from 'pdfjs-dist';

// Set up PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

/**
 * Convert image to PDF
 * @param {File} file - Image file
 * @param {Object} options - PDF options
 * @returns {Promise<Blob>} PDF blob
 */
export async function imageToPDF(file, options = {}) {
    const {
        pageSize = 'a4', // 'a4', 'letter', 'legal', 'custom'
        orientation = 'portrait', // 'portrait' or 'landscape'
        fitToPage = true,
        quality = 0.92,
        customWidth = 210, // mm (for custom size)
        customHeight = 297, // mm (for custom size)
    } = options;

    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = (e) => {
            const img = new Image();

            img.onload = () => {
                try {
                    // Create jsPDF instance
                    const pdf = new jsPDF({
                        orientation,
                        unit: 'mm',
                        format: pageSize === 'custom' ? [customWidth, customHeight] : pageSize,
                    });

                    // Get page dimensions
                    const pageWidth = pdf.internal.pageSize.getWidth();
                    const pageHeight = pdf.internal.pageSize.getHeight();

                    // Calculate image dimensions
                    let imgWidth = img.width;
                    let imgHeight = img.height;

                    if (fitToPage) {
                        // Calculate aspect ratios
                        const imgRatio = imgWidth / imgHeight;
                        const pageRatio = pageWidth / pageHeight;

                        if (imgRatio > pageRatio) {
                            // Image is wider than page
                            imgWidth = pageWidth - 20; // 10mm margin on each side
                            imgHeight = imgWidth / imgRatio;
                        } else {
                            // Image is taller than page
                            imgHeight = pageHeight - 20; // 10mm margin on top/bottom
                            imgWidth = imgHeight * imgRatio;
                        }
                    } else {
                        // Convert pixels to mm (assuming 96 DPI)
                        imgWidth = (imgWidth * 25.4) / 96;
                        imgHeight = (imgHeight * 25.4) / 96;
                    }

                    // Center image on page
                    const x = (pageWidth - imgWidth) / 2;
                    const y = (pageHeight - imgHeight) / 2;

                    // Add image to PDF
                    pdf.addImage(
                        e.target.result,
                        file.type.split('/')[1].toUpperCase(),
                        x,
                        y,
                        imgWidth,
                        imgHeight,
                        undefined,
                        'FAST'
                    );

                    // Convert to blob
                    const pdfBlob = pdf.output('blob');
                    resolve(pdfBlob);
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
 * Convert multiple images to a single PDF (multi-page)
 * @param {File[]} files - Array of image files
 * @param {Object} options - PDF options
 * @returns {Promise<Blob>} PDF blob
 */
export async function multipleImagesToPDF(files, options = {}) {
    const {
        pageSize = 'a4',
        orientation = 'portrait',
        fitToPage = true,
        quality = 0.92,
    } = options;

    const pdf = new jsPDF({
        orientation,
        unit: 'mm',
        format: pageSize,
    });

    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();

    for (let i = 0; i < files.length; i++) {
        const file = files[i];

        if (i > 0) {
            pdf.addPage();
        }

        const imageData = await readFileAsDataURL(file);
        const img = await loadImage(imageData);

        let imgWidth = img.width;
        let imgHeight = img.height;

        if (fitToPage) {
            const imgRatio = imgWidth / imgHeight;
            const pageRatio = pageWidth / pageHeight;

            if (imgRatio > pageRatio) {
                imgWidth = pageWidth - 20;
                imgHeight = imgWidth / imgRatio;
            } else {
                imgHeight = pageHeight - 20;
                imgWidth = imgHeight * imgRatio;
            }
        } else {
            imgWidth = (imgWidth * 25.4) / 96;
            imgHeight = (imgHeight * 25.4) / 96;
        }

        const x = (pageWidth - imgWidth) / 2;
        const y = (pageHeight - imgHeight) / 2;

        pdf.addImage(
            imageData,
            file.type.split('/')[1].toUpperCase(),
            x,
            y,
            imgWidth,
            imgHeight,
            undefined,
            'FAST'
        );
    }

    return pdf.output('blob');
}

/**
 * Extract images from PDF
 * @param {File} file - PDF file
 * @returns {Promise<Array>} Array of image blobs
 */
export async function extractImagesFromPDF(file) {
    try {
        const arrayBuffer = await file.arrayBuffer();
        const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
        const images = [];

        for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
            const page = await pdf.getPage(pageNum);
            const viewport = page.getViewport({ scale: 2.0 });

            // Create canvas
            const canvas = document.createElement('canvas');
            const context = canvas.getContext('2d');
            canvas.width = viewport.width;
            canvas.height = viewport.height;

            // Render page to canvas
            await page.render({
                canvasContext: context,
                viewport: viewport,
            }).promise;

            // Convert canvas to blob
            const blob = await new Promise((resolve) => {
                canvas.toBlob((b) => resolve(b), 'image/png');
            });

            images.push({
                blob,
                page: pageNum,
                width: viewport.width,
                height: viewport.height,
            });
        }

        return images;
    } catch (error) {
        console.error('Error extracting images from PDF:', error);
        throw error;
    }
}

/**
 * Get PDF metadata
 * @param {File} file - PDF file
 * @returns {Promise<Object>} PDF metadata
 */
export async function getPDFMetadata(file) {
    try {
        const arrayBuffer = await file.arrayBuffer();
        const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
        const metadata = await pdf.getMetadata();

        return {
            numPages: pdf.numPages,
            title: metadata.info.Title || 'Untitled',
            author: metadata.info.Author || 'Unknown',
            subject: metadata.info.Subject || '',
            keywords: metadata.info.Keywords || '',
            creator: metadata.info.Creator || '',
            producer: metadata.info.Producer || '',
            creationDate: metadata.info.CreationDate || null,
        };
    } catch (error) {
        console.error('Error reading PDF metadata:', error);
        throw error;
    }
}

// Helper functions
function readFileAsDataURL(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}

function loadImage(src) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = reject;
        img.src = src;
    });
}
