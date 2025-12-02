import { saveAs } from 'file-saver';
import JSZip from 'jszip';

export function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

export function validateImageFile(file, maxSize = 50 * 1024 * 1024) {
    const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/bmp', 'application/pdf'];

    if (!validTypes.includes(file.type)) {
        return { valid: false, error: 'Invalid file type. Supported formats: JPG, PNG, GIF, WEBP, BMP, PDF' };
    }

    if (file.size > maxSize) {
        return { valid: false, error: `File too large. Max size is ${formatFileSize(maxSize)}` };
    }

    return { valid: true };
}

export async function generateThumbnail(file, maxSize = 160) {
    return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            const img = new Image();
            img.onload = () => {
                const canvas = document.createElement('canvas');
                let width = img.width;
                let height = img.height;

                if (width > height) {
                    if (width > maxSize) {
                        height *= maxSize / width;
                        width = maxSize;
                    }
                } else {
                    if (height > maxSize) {
                        width *= maxSize / height;
                        height = maxSize;
                    }
                }

                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, width, height);
                resolve(canvas.toDataURL());
            };
            img.src = e.target.result;
        };
        reader.readAsDataURL(file);
    });
}

export function downloadFile(blob, filename) {
    saveAs(blob, filename);
}

export async function createZIP(files, zipName = 'converted-images.zip') {
    const zip = new JSZip();

    files.forEach(file => {
        zip.file(file.name, file.blob);
    });

    const content = await zip.generateAsync({ type: 'blob' });
    return content;
}

export function generateFilename(originalName, targetFormat, options = {}) {
    const nameWithoutExt = originalName.substring(0, originalName.lastIndexOf('.'));
    let newName = nameWithoutExt;

    if (options.prefix) newName = `${options.prefix}${newName}`;
    if (options.suffix) newName = `${newName}${options.suffix}`;

    return `${newName}.${targetFormat}`;
}
