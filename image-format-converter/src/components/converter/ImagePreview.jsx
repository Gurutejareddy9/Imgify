import React, { useState, useRef, useEffect } from 'react';
import { ZoomIn, ZoomOut, Move } from 'lucide-react';
import { formatFileSize } from '../../utils/fileHelpers';
import Badge from '../common/Badge';

const ImagePreview = ({ originalFile, convertedFile }) => {
    const [sliderPosition, setSliderPosition] = useState(50);
    const [zoom, setZoom] = useState(100);
    const containerRef = useRef(null);
    const [isDragging, setIsDragging] = useState(false);

    const handleDrag = (e) => {
        if (!containerRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();
        const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
        setSliderPosition((x / rect.width) * 100);
    };

    const handleMouseDown = () => setIsDragging(true);
    const handleMouseUp = () => setIsDragging(false);
    const handleMouseMove = (e) => {
        if (isDragging) handleDrag(e);
    };

    useEffect(() => {
        if (isDragging) {
            window.addEventListener('mousemove', handleMouseMove);
            window.addEventListener('mouseup', handleMouseUp);
        }
        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        };
    }, [isDragging]);

    if (!originalFile) return null;

    const originalUrl = originalFile.preview;
    const convertedUrl = convertedFile ? URL.createObjectURL(convertedFile.blob) : originalUrl;

    // Calculate size difference
    const sizeDiff = convertedFile ? ((convertedFile.size - originalFile.file.size) / originalFile.file.size) * 100 : 0;
    const isSmaller = sizeDiff <= 0;

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-900">Preview</h3>
                <div className="flex space-x-2">
                    <button onClick={() => setZoom(z => Math.max(10, z - 10))} className="p-2 hover:bg-gray-100 rounded-lg">
                        <ZoomOut className="w-5 h-5 text-gray-600" />
                    </button>
                    <span className="py-2 text-sm font-medium text-gray-600">{zoom}%</span>
                    <button onClick={() => setZoom(z => Math.min(200, z + 10))} className="p-2 hover:bg-gray-100 rounded-lg">
                        <ZoomIn className="w-5 h-5 text-gray-600" />
                    </button>
                </div>
            </div>

            <div
                ref={containerRef}
                className="relative h-[400px] bg-gray-100 rounded-xl overflow-hidden cursor-col-resize select-none border border-gray-200"
                onMouseDown={handleMouseDown}
            >
                {/* Background Pattern for Transparency */}
                <div className="absolute inset-0 opacity-20"
                    style={{ backgroundImage: 'radial-gradient(#cbd5e1 1px, transparent 1px)', backgroundSize: '10px 10px' }}>
                </div>

                {/* Images */}
                <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
                    <div
                        className="relative w-full h-full flex items-center justify-center"
                        style={{ transform: `scale(${zoom / 100})` }}
                    >
                        {/* Original Image (Left/Bottom) */}
                        <img
                            src={originalUrl}
                            alt="Original"
                            className="absolute max-w-none h-full object-contain"
                            style={{ width: '100%' }}
                        />

                        {/* Converted Image (Right/Top - Clipped) */}
                        <div
                            className="absolute inset-0 overflow-hidden"
                            style={{ clipPath: `polygon(${sliderPosition}% 0, 100% 0, 100% 100%, ${sliderPosition}% 100%)` }}
                        >
                            <img
                                src={convertedUrl}
                                alt="Converted"
                                className="absolute max-w-none h-full object-contain"
                                style={{ width: '100%' }}
                            />
                        </div>
                    </div>
                </div>

                {/* Slider Handle */}
                <div
                    className="absolute top-0 bottom-0 w-1 bg-white cursor-ew-resize shadow-lg z-10"
                    style={{ left: `${sliderPosition}%` }}
                >
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-white rounded-full shadow-md flex items-center justify-center">
                        <Move className="w-4 h-4 text-primary-600" />
                    </div>
                </div>

                {/* Labels */}
                <div className="absolute bottom-4 left-4 bg-black/50 text-white px-3 py-1 rounded-full text-xs backdrop-blur-sm">
                    Original
                </div>
                <div className="absolute bottom-4 right-4 bg-black/50 text-white px-3 py-1 rounded-full text-xs backdrop-blur-sm">
                    Converted
                </div>
            </div>

            {/* Stats */}
            {convertedFile && (
                <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-gray-50 rounded-lg">
                        <p className="text-xs text-gray-500 mb-1">Original Size</p>
                        <p className="font-semibold text-gray-900">{formatFileSize(originalFile.file.size)}</p>
                    </div>
                    <div className="p-4 bg-primary-50 rounded-lg border border-primary-100">
                        <p className="text-xs text-primary-600 mb-1">Converted Size</p>
                        <div className="flex items-center space-x-2">
                            <p className="font-semibold text-primary-900">{formatFileSize(convertedFile.size)}</p>
                            <Badge variant={isSmaller ? 'success' : 'warning'}>
                                {isSmaller ? '↓' : '↑'} {Math.abs(sizeDiff).toFixed(1)}%
                            </Badge>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ImagePreview;
