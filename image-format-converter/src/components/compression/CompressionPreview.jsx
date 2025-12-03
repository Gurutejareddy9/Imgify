import React, { useState } from 'react';
import { Download, X, Loader, CheckCircle, AlertCircle, FileText } from 'lucide-react';
import { formatFileSize, calculateSavings } from '../../utils/imageCompression';

export default function CompressionPreview({
    file,
    compressed,
    isCompressing,
    onRemove,
    onCompress,
    onDownload,
    error,
}) {
    const [previewUrl] = useState(() => URL.createObjectURL(file));

    const savings = compressed
        ? calculateSavings(file.size, compressed.metadata.compressedSize)
        : 0;

    return (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
            {/* Image Preview */}
            <div className="relative aspect-square bg-gray-50 bg-[length:20px_20px] bg-[image:linear-gradient(45deg,#f3f4f6_25%,transparent_25%,transparent_75%,#f3f4f6_75%),linear-gradient(45deg,#f3f4f6_25%,transparent_25%,transparent_75%,#f3f4f6_75%)] bg-[position:0_0,10px_10px]">
                <img
                    src={previewUrl}
                    alt={file.name}
                    className="w-full h-full object-contain"
                />

                {/* Remove Button */}
                <button
                    onClick={onRemove}
                    className="absolute top-2 right-2 w-8 h-8 bg-gray-900 text-white rounded-full flex items-center justify-center hover:bg-black transition-colors shadow-lg"
                >
                    <X className="w-4 h-4" />
                </button>

                {/* Status Overlay */}
                {isCompressing && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                        <Loader className="w-8 h-8 text-white animate-spin" />
                    </div>
                )}

                {compressed && (
                    <div className="absolute top-2 left-2 bg-black text-white px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                        <CheckCircle className="w-3 h-3" />
                        Done
                    </div>
                )}

                {error && (
                    <div className="absolute inset-0 bg-gray-900/80 flex items-center justify-center p-4">
                        <div className="text-center">
                            <AlertCircle className="w-8 h-8 text-white mx-auto mb-2" />
                            <p className="text-white text-sm">{error}</p>
                        </div>
                    </div>
                )}
                {file.type === 'application/pdf' && (
                    <div className="absolute bottom-2 left-2 bg-black text-white px-2 py-1 rounded text-xs font-medium flex items-center gap-1">
                        <FileText className="w-3 h-3" />
                        PDF
                    </div>
                )}
            </div>

            {/* File Info */}
            <div className="p-4 space-y-3">
                {/* Filename */}
                <div className="font-medium text-gray-900 truncate" title={file.name}>
                    {file.name}
                </div>

                {/* Size Info */}
                <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">
                        {formatFileSize(file.size)}
                    </span>
                    {compressed && (
                        <>
                            <span className="text-gray-400">→</span>
                            <span className="font-semibold text-black">
                                {formatFileSize(compressed.metadata.compressedSize)}
                            </span>
                        </>
                    )}
                </div>

                {/* Savings Badge */}
                {compressed && (
                    <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${savings > 0 ? 'bg-gray-900 text-white' : 'bg-gray-200 text-gray-600'
                        }`}>
                        {savings > 0 ? `${savings}% smaller` : 'No reduction'}
                    </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-2 pt-2">
                    {!compressed && !isCompressing && !error && (
                        <button
                            onClick={onCompress}
                            className="flex-1 btn-primary text-sm py-2"
                        >
                            Compress
                        </button>
                    )}

                    {compressed && (
                        <button
                            onClick={onDownload}
                            className="flex-1 btn-primary text-sm py-2 flex items-center justify-center gap-2"
                        >
                            <Download className="w-4 h-4" />
                            Download
                        </button>
                    )}

                    {error && (
                        <button
                            onClick={onCompress}
                            className="flex-1 btn-secondary text-sm py-2"
                        >
                            Retry
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
