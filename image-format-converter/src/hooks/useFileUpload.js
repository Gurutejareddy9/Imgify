import { useState, useCallback } from 'react';
import { validateImageFile } from '../utils/fileHelpers';

export function useFileUpload(maxFiles = 50, maxSize = 50 * 1024 * 1024) {
    const [uploadedFiles, setUploadedFiles] = useState([]);
    const [errors, setErrors] = useState([]);
    const [isDragging, setIsDragging] = useState(false);

    const handleFiles = useCallback((acceptedFiles, rejectedFiles) => {
        const newFiles = [];
        const newErrors = [];

        // Handle rejected files first
        if (rejectedFiles && rejectedFiles.length > 0) {
            rejectedFiles.forEach(rejection => {
                newErrors.push({
                    file: rejection.file.name,
                    error: rejection.errors[0].message
                });
            });
        }

        // Handle accepted files
        acceptedFiles.forEach(file => {
            if (uploadedFiles.length + newFiles.length >= maxFiles) {
                newErrors.push({
                    file: file.name,
                    error: `Max file limit (${maxFiles}) reached`
                });
                return;
            }

            const validation = validateImageFile(file, maxSize);
            if (!validation.valid) {
                newErrors.push({
                    file: file.name,
                    error: validation.error
                });
            } else {
                newFiles.push({
                    id: Math.random().toString(36).substr(2, 9),
                    file,
                    preview: URL.createObjectURL(file)
                });
            }
        });

        setUploadedFiles(prev => [...prev, ...newFiles]);
        setErrors(prev => [...prev, ...newErrors]);

        // Auto-clear errors after 5 seconds
        if (newErrors.length > 0) {
            setTimeout(() => {
                setErrors(prev => prev.filter(e => !newErrors.includes(e)));
            }, 5000);
        }

        return newFiles;
    }, [uploadedFiles, maxFiles, maxSize]);

    const removeFile = useCallback((fileId) => {
        setUploadedFiles(prev => {
            const fileToRemove = prev.find(f => f.id === fileId);
            if (fileToRemove) {
                URL.revokeObjectURL(fileToRemove.preview);
            }
            return prev.filter(f => f.id !== fileId);
        });
    }, []);

    const clearFiles = useCallback(() => {
        uploadedFiles.forEach(f => URL.revokeObjectURL(f.preview));
        setUploadedFiles([]);
        setErrors([]);
    }, [uploadedFiles]);

    return {
        uploadedFiles,
        errors,
        isDragging,
        setIsDragging,
        handleFiles,
        removeFile,
        clearFiles
    };
}
