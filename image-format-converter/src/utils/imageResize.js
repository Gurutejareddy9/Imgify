import { extractImagesFromPDF } from './pdfConverter';

export async function resizeImage(file, options = {}) {
    // Check if file is PDF
    if (file.type === 'application/pdf') {
        try {
            // Extract images from PDF
            const images = await extractImagesFromPDF(file);

            if (images.length === 0) {
                throw new Error('No images found in PDF');
            }

            // Use first page
            const firstImage = images[0];

            // Convert blob to file-like object for resizing logic
            // In a real implementation, we would pass the blob/image data directly to the resize function
            // For now, we return the extracted image as is, simulating a resize pipeline entry
            return {
                blob: firstImage.blob,
                width: firstImage.width,
                height: firstImage.height,
                originalFile: file
            };
        } catch (error) {
            console.error('Error resizing PDF:', error);
            throw error;
        }
    }

    // Standard image resize logic would go here
    return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => {
            resolve({
                blob: file, // Return original for now
                width: img.width,
                height: img.height,
                originalFile: file
            });
        };
        img.src = URL.createObjectURL(file);
    });
}
