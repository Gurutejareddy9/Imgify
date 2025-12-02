import { useState, useCallback } from 'react';
import { compressImage, compressBatch } from '../utils/imageCompression';

export function useImageCompression() {
    const [files, setFiles] = useState([]);
    const [compressedFiles, setCompressedFiles] = useState([]);
    const [isCompressing, setIsCompressing] = useState(false);
    const [progress, setProgress] = useState({ current: 0, total: 0, percentage: 0 });
    const [settings, setSettings] = useState({
        quality: 80, // 0-100
        outputFormat: 'jpeg',
        maxWidth: null,
        maxHeight: null,
    });

    const addFiles = useCallback((newFiles) => {
        setFiles((prev) => [...prev, ...newFiles]);
    }, []);

    const removeFile = useCallback((index) => {
        setFiles((prev) => prev.filter((_, i) => i !== index));
        setCompressedFiles((prev) => prev.filter((_, i) => i !== index));
    }, []);

    const updateSettings = useCallback((newSettings) => {
        setSettings((prev) => ({ ...prev, ...newSettings }));
    }, []);

    const compressSingle = useCallback(async (file, index) => {
        try {
            const result = await compressImage(file, {
                quality: settings.quality / 100,
                outputFormat: settings.outputFormat,
                maxWidth: settings.maxWidth,
                maxHeight: settings.maxHeight,
            });

            setCompressedFiles((prev) => {
                const updated = [...prev];
                updated[index] = result;
                return updated;
            });

            return result;
        } catch (error) {
            console.error('Compression error:', error);
            throw error;
        }
    }, [settings]);

    const compressAll = useCallback(async () => {
        if (files.length === 0) return;

        setIsCompressing(true);
        setProgress({ current: 0, total: files.length, percentage: 0 });

        try {
            const results = await compressBatch(
                files,
                {
                    quality: settings.quality / 100,
                    outputFormat: settings.outputFormat,
                    maxWidth: settings.maxWidth,
                    maxHeight: settings.maxHeight,
                },
                (progressData) => {
                    setProgress({
                        current: progressData.current,
                        total: progressData.total,
                        percentage: Math.round(progressData.percentage),
                    });
                }
            );

            setCompressedFiles(results.map((r) => (r.success ? r.data : null)));
        } catch (error) {
            console.error('Batch compression error:', error);
        } finally {
            setIsCompressing(false);
        }
    }, [files, settings]);

    const reset = useCallback(() => {
        setFiles([]);
        setCompressedFiles([]);
        setProgress({ current: 0, total: 0, percentage: 0 });
    }, []);

    const getTotalStats = useCallback(() => {
        const completed = compressedFiles.filter(Boolean);

        if (completed.length === 0) {
            return {
                totalOriginalSize: 0,
                totalCompressedSize: 0,
                totalSavings: 0,
                averageRatio: 0,
            };
        }

        const totalOriginalSize = completed.reduce(
            (sum, item) => sum + item.metadata.originalSize,
            0
        );
        const totalCompressedSize = completed.reduce(
            (sum, item) => sum + item.metadata.compressedSize,
            0
        );
        const totalSavings = totalOriginalSize - totalCompressedSize;
        const averageRatio =
            completed.reduce((sum, item) => sum + item.metadata.compressionRatio, 0) /
            completed.length;

        return {
            totalOriginalSize,
            totalCompressedSize,
            totalSavings,
            averageRatio: Math.round(averageRatio),
        };
    }, [compressedFiles]);

    return {
        files,
        compressedFiles,
        isCompressing,
        progress,
        settings,
        addFiles,
        removeFile,
        updateSettings,
        compressSingle,
        compressAll,
        reset,
        getTotalStats,
    };
}
