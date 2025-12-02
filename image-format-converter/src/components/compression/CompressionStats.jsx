import React from 'react';
import { ArrowDown, ArrowUp, File, TrendingDown } from 'lucide-react';
import { formatFileSize, calculateSavings } from '../../utils/imageCompression';

export default function CompressionStats({ original, compressed, metadata }) {
    const savings = calculateSavings(metadata.originalSize, metadata.compressedSize);
    const isSaving = savings > 0;

    return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {/* Original Size */}
            <div className="bg-white rounded-lg border border-gray-200 p-4">
                <div className="flex items-center gap-2 mb-2">
                    <File className="w-4 h-4 text-gray-500" />
                    <span className="text-xs font-medium text-gray-500 uppercase">
                        Original
                    </span>
                </div>
                <div className="text-2xl font-bold text-gray-900">
                    {formatFileSize(metadata.originalSize)}
                </div>
                <div className="text-xs text-gray-500 mt-1">
                    {metadata.originalDimensions.width} × {metadata.originalDimensions.height}
                </div>
            </div>

            {/* Compressed Size */}
            <div className="bg-white rounded-lg border border-gray-200 p-4">
                <div className="flex items-center gap-2 mb-2">
                    <File className="w-4 h-4 text-gray-700" />
                    <span className="text-xs font-medium text-gray-700 uppercase">
                        Compressed
                    </span>
                </div>
                <div className="text-2xl font-bold text-black">
                    {formatFileSize(metadata.compressedSize)}
                </div>
                <div className="text-xs text-gray-600 mt-1">
                    {metadata.newDimensions.width} × {metadata.newDimensions.height}
                </div>
            </div>

            {/* Savings */}
            <div className={`rounded-lg border-2 p-4 ${isSaving ? 'bg-gray-50 border-gray-300' : 'bg-white border-gray-200'
                }`}>
                <div className="flex items-center gap-2 mb-2">
                    <TrendingDown className={`w-4 h-4 ${isSaving ? 'text-gray-700' : 'text-gray-500'}`} />
                    <span className={`text-xs font-medium uppercase ${isSaving ? 'text-gray-700' : 'text-gray-500'
                        }`}>
                        Saved
                    </span>
                </div>
                <div className="flex items-baseline gap-2">
                    <div className={`text-2xl font-bold ${isSaving ? 'text-black' : 'text-gray-500'}`}>
                        {Math.abs(savings)}%
                    </div>
                    {isSaving ? (
                        <ArrowDown className="w-5 h-5 text-gray-700" />
                    ) : (
                        <ArrowUp className="w-5 h-5 text-gray-500" />
                    )}
                </div>
                <div className="text-xs text-gray-600 mt-1">
                    {isSaving
                        ? `${formatFileSize(metadata.originalSize - metadata.compressedSize)} smaller`
                        : 'No reduction'}
                </div>
            </div>

            {/* Quality */}
            <div className="bg-white rounded-lg border border-gray-200 p-4">
                <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-medium text-gray-500 uppercase">
                        Quality
                    </span>
                </div>
                <div className="text-2xl font-bold text-gray-900">
                    {Math.round(metadata.quality * 100)}%
                </div>
                <div className="text-xs text-gray-500 mt-1 capitalize">
                    {metadata.format} format
                </div>
            </div>
        </div>
    );
}
