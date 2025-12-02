import { useState } from 'react';
import { convertImage, convertBatchToPDF } from '../utils/imageConverter';
import { downloadFile, createZIP, generateFilename } from '../utils/fileHelpers';

export function useImageConverter() {
    const [files, setFiles] = useState([]);
    const [targetFormat, setTargetFormat] = useState('jpg');
    const [settings, setSettings] = useState({
        quality: 90,
        progressive: false,
        compression: 6,
        preserveTransparency: true,
        lossless: false,
        dithering: 'none',
        bitDepth: 24,
        // PDF defaults
        pageSize: 'a4',
        orientation: 'portrait',
        fitToPage: true,
        multiPage: false
    });
    const [conversionQueue, setConversionQueue] = useState([]);
    const [isProcessing, setIsProcessing] = useState(false);
    const [progress, setProgress] = useState(0);

    const addFiles = (newFiles) => {
        setFiles(prev => [...prev, ...newFiles]);
    };

    const removeFile = (fileId) => {
        setFiles(prev => prev.filter(f => f.id !== fileId));
        setConversionQueue(prev => prev.filter(f => f.sourceId !== fileId));
    };

    const updateSettings = (newSettings) => {
        setSettings(prev => ({ ...prev, ...newSettings }));
    };

    const convertSingleFile = async (file) => {
        try {
            const result = await convertImage(file.file, targetFormat, settings);
            const newFilename = generateFilename(file.file.name, targetFormat);
            return { ...result, filename: newFilename, sourceId: file.id };
        } catch (error) {
            console.error(error);
            throw error;
        }
    };

    const convertAllFiles = async () => {
        setIsProcessing(true);
        setProgress(0);

        // Special handling for PDF multi-page
        if (targetFormat === 'pdf' && settings.multiPage && files.length > 1) {
            try {
                // Initialize queue items
                const newQueueItems = files.map(f => ({
                    sourceId: f.id,
                    status: 'processing',
                    originalName: f.file.name,
                    originalSize: f.file.size
                }));
                setConversionQueue(newQueueItems);

                const results = await convertBatchToPDF(files.map(f => f.file), settings);
                const result = results[0]; // Single result for multi-page

                // Update all items to complete, pointing to the same result
                setConversionQueue(files.map(f => ({
                    sourceId: f.id,
                    status: 'complete',
                    originalName: f.file.name,
                    originalSize: f.file.size,
                    result: result, // Same result for all
                    convertedSize: result.size / files.length // Approximate share
                })));
                setProgress(100);
            } catch (error) {
                console.error('Batch PDF conversion error:', error);
                setConversionQueue(files.map(f => ({
                    sourceId: f.id,
                    status: 'error',
                    originalName: f.file.name,
                    originalSize: f.file.size,
                    error: error.message
                })));
            }
            setIsProcessing(false);
            return;
        }

        // Initialize queue items if not present
        const newQueueItems = files
            .filter(f => !conversionQueue.find(q => q.sourceId === f.id))
            .map(f => ({
                sourceId: f.id,
                status: 'queued',
                originalName: f.file.name,
                originalSize: f.file.size
            }));

        setConversionQueue(prev => [...prev, ...newQueueItems]);

        // Process queue
        for (let i = 0; i < files.length; i++) {
            const file = files[i];

            // Skip if already completed
            const existing = conversionQueue.find(q => q.sourceId === file.id);
            if (existing && existing.status === 'complete') continue;

            try {
                // Update status to processing
                setConversionQueue(prev => prev.map(p =>
                    p.sourceId === file.id ? { ...p, status: 'processing' } : p
                ));

                const result = await convertSingleFile(file);

                setConversionQueue(prev => prev.map(p =>
                    p.sourceId === file.id ? {
                        ...p,
                        status: 'complete',
                        result,
                        convertedSize: result.size
                    } : p
                ));

            } catch (error) {
                setConversionQueue(prev => prev.map(p =>
                    p.sourceId === file.id ? { ...p, status: 'error', error: error.message } : p
                ));
            }
            setProgress(((i + 1) / files.length) * 100);
        }

        setIsProcessing(false);
    };

    const downloadConverted = (sourceId) => {
        const item = conversionQueue.find(p => p.sourceId === sourceId);
        if (item && item.status === 'complete') {
            downloadFile(item.result.blob, item.result.filename);
        }
    };

    const downloadAllAsZIP = async () => {
        const completed = conversionQueue.filter(p => p.status === 'complete').map(p => ({
            name: p.result.filename,
            blob: p.result.blob
        }));

        if (completed.length > 0) {
            const zipBlob = await createZIP(completed);
            downloadFile(zipBlob, 'converted_images.zip');
        }
    };

    const reset = () => {
        setFiles([]);
        setConversionQueue([]);
        setProgress(0);
        setIsProcessing(false);
    };

    return {
        files,
        targetFormat,
        setTargetFormat,
        settings,
        conversionQueue,
        isProcessing,
        progress,
        addFiles,
        removeFile,
        convertAllFiles,
        updateSettings,
        downloadConverted,
        downloadAllAsZIP,
        reset
    };
}
