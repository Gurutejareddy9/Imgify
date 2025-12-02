import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Download, Upload, Trash2, Loader } from 'lucide-react';
import { saveAs } from 'file-saver';
import JSZip from 'jszip';

import CompressionControls from '../components/compression/CompressionControls';
import CompressionPreview from '../components/compression/CompressionPreview';
import BeforeAfterComparison from '../components/compression/BeforeAfterComparison';
import CompressionStats from '../components/compression/CompressionStats';
import { useImageCompression } from '../hooks/useImageCompression';
import { formatFileSize } from '../utils/imageCompression';

export default function Compress() {
    const {
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
    } = useImageCompression();

    const onDrop = useCallback(
        (acceptedFiles) => {
            addFiles(acceptedFiles);
        },
        [addFiles]
    );

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'image/*': ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.bmp'],
        },
        multiple: true,
        maxSize: 50 * 1024 * 1024, // 50MB
    });

    const handleDownloadAll = async () => {
        const completed = compressedFiles.filter(Boolean);

        if (completed.length === 0) return;

        if (completed.length === 1) {
            // Single file - direct download
            saveAs(completed[0].blob, `compressed-${files[0].name}`);
            return;
        }

        // Multiple files - create ZIP
        const zip = new JSZip();

        completed.forEach((item, index) => {
            if (item) {
                const filename = `compressed-${files[index].name}`;
                zip.file(filename, item.blob);
            }
        });

        const blob = await zip.generateAsync({ type: 'blob' });
        saveAs(blob, 'compressed-images.zip');
    };

    const handleDownloadSingle = (index) => {
        const compressed = compressedFiles[index];
        if (!compressed) return;

        saveAs(compressed.blob, `compressed-${files[index].name}`);
    };

    const stats = getTotalStats();
    const hasCompletedFiles = compressedFiles.some(Boolean);
    const allCompleted = files.length > 0 && compressedFiles.filter(Boolean).length === files.length;

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Page Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        Image Compression
                    </h1>
                    <p className="text-gray-600">
                        Reduce file size while maintaining quality
                    </p>
                </div>

                {/* Upload Zone (show when no files) */}
                {files.length === 0 && (
                    <div
                        {...getRootProps()}
                        className={`border-2 border-dashed rounded-xl p-12 text-center transition-all cursor-pointer
              ${isDragActive
                                ? 'border-black bg-gray-100 scale-[1.02]'
                                : 'border-gray-300 bg-white hover:border-gray-400 hover:bg-gray-50'
                            }`}
                    >
                        <input {...getInputProps()} />
                        <Upload className={`w-16 h-16 mx-auto mb-4 ${isDragActive ? 'text-black' : 'text-gray-400'
                            }`} />
                        <p className="text-xl font-semibold text-gray-900 mb-2">
                            {isDragActive ? 'Drop images here' : 'Drag & drop images here'}
                        </p>
                        <p className="text-gray-600 mb-4">or click to browse files</p>
                        <p className="text-sm text-gray-500">
                            Supports JPG, PNG, GIF, WEBP, BMP (max 50MB per file)
                        </p>
                    </div>
                )}

                {/* Main Content (show when files uploaded) */}
                {files.length > 0 && (
                    <div className="grid lg:grid-cols-4 gap-6">
                        {/* Settings Sidebar */}
                        <div className="lg:col-span-1">
                            <CompressionControls
                                settings={settings}
                                onSettingsChange={updateSettings}
                                disabled={isCompressing}
                            />
                        </div>

                        {/* Preview Area */}
                        <div className="lg:col-span-3 space-y-6">
                            {/* Batch Actions Bar */}
                            <div className="bg-white rounded-xl border border-gray-200 p-4 flex items-center justify-between gap-4 flex-wrap">
                                <div className="flex items-center gap-4">
                                    <span className="text-sm text-gray-600">
                                        {files.length} {files.length === 1 ? 'image' : 'images'}
                                    </span>
                                    {hasCompletedFiles && (
                                        <span className="text-sm font-medium text-black">
                                            {compressedFiles.filter(Boolean).length} compressed
                                        </span>
                                    )}
                                </div>

                                <div className="flex gap-2">
                                    {!allCompleted && (
                                        <button
                                            onClick={compressAll}
                                            disabled={isCompressing}
                                            className="btn-primary flex items-center gap-2"
                                        >
                                            {isCompressing ? (
                                                <>
                                                    <Loader className="w-4 h-4 animate-spin" />
                                                    Compressing... ({progress.percentage}%)
                                                </>
                                            ) : (
                                                'Compress All'
                                            )}
                                        </button>
                                    )}

                                    {hasCompletedFiles && (
                                        <button
                                            onClick={handleDownloadAll}
                                            className="btn-secondary flex items-center gap-2"
                                        >
                                            <Download className="w-4 h-4" />
                                            Download All
                                        </button>
                                    )}

                                    <button
                                        onClick={reset}
                                        className="btn-ghost flex items-center gap-2"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                        Clear All
                                    </button>
                                </div>
                            </div>

                            {/* Stats Summary (show when has completed files) */}
                            {hasCompletedFiles && stats.totalOriginalSize > 0 && (
                                <div className="bg-white rounded-xl border border-gray-200 p-6">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                                        Compression Summary
                                    </h3>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                        <div>
                                            <div className="text-xs text-gray-500 uppercase mb-1">
                                                Original Size
                                            </div>
                                            <div className="text-xl font-bold text-gray-900">
                                                {formatFileSize(stats.totalOriginalSize)}
                                            </div>
                                        </div>
                                        <div>
                                            <div className="text-xs text-gray-500 uppercase mb-1">
                                                Compressed Size
                                            </div>
                                            <div className="text-xl font-bold text-black">
                                                {formatFileSize(stats.totalCompressedSize)}
                                            </div>
                                        </div>
                                        <div>
                                            <div className="text-xs text-gray-500 uppercase mb-1">
                                                Total Saved
                                            </div>
                                            <div className="text-xl font-bold text-gray-900">
                                                {formatFileSize(stats.totalSavings)}
                                            </div>
                                        </div>
                                        <div>
                                            <div className="text-xs text-gray-500 uppercase mb-1">
                                                Average Reduction
                                            </div>
                                            <div className="text-xl font-bold text-gray-900">
                                                {stats.averageRatio}%
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Before/After Comparison (show for first completed file) */}
                            {files.length > 0 && compressedFiles[0] && (
                                <BeforeAfterComparison
                                    original={URL.createObjectURL(files[0])}
                                    compressed={URL.createObjectURL(compressedFiles[0].blob)}
                                />
                            )}

                            {/* Individual Stats (show for first completed file) */}
                            {files.length > 0 && compressedFiles[0] && (
                                <CompressionStats
                                    original={files[0]}
                                    compressed={compressedFiles[0]}
                                    metadata={compressedFiles[0].metadata}
                                />
                            )}

                            {/* File Grid */}
                            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                {files.map((file, index) => (
                                    <CompressionPreview
                                        key={`${file.name}-${index}`}
                                        file={file}
                                        compressed={compressedFiles[index]}
                                        isCompressing={isCompressing && !compressedFiles[index]}
                                        onRemove={() => removeFile(index)}
                                        onCompress={() => compressSingle(file, index)}
                                        onDownload={() => handleDownloadSingle(index)}
                                    />
                                ))}
                            </div>

                            {/* Add More Button */}
                            <div
                                {...getRootProps()}
                                className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-gray-400 hover:bg-gray-50 transition-all cursor-pointer"
                            >
                                <input {...getInputProps()} />
                                <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                                <p className="text-sm font-medium text-gray-700">
                                    Add more images
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
