import React, { useState } from 'react';
import { ZoomIn, ZoomOut, Maximize2 } from 'lucide-react';

export default function BeforeAfterComparison({ original, compressed }) {
    const [sliderPosition, setSliderPosition] = useState(50);
    const [zoom, setZoom] = useState(100);
    const [isDragging, setIsDragging] = useState(false);

    const handleMouseMove = (e) => {
        if (!isDragging) return;

        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const percentage = (x / rect.width) * 100;
        setSliderPosition(Math.max(0, Math.min(100, percentage)));
    };

    const handleTouchMove = (e) => {
        if (!isDragging) return;

        const touch = e.touches[0];
        const rect = e.currentTarget.getBoundingClientRect();
        const x = touch.clientX - rect.left;
        const percentage = (x / rect.width) * 100;
        setSliderPosition(Math.max(0, Math.min(100, percentage)));
    };

    return (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
                <h3 className="font-semibold text-gray-900">Preview Comparison</h3>

                {/* Zoom Controls */}
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setZoom(Math.max(50, zoom - 25))}
                        disabled={zoom <= 50}
                        className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        <ZoomOut className="w-4 h-4 text-gray-700" />
                    </button>
                    <span className="text-sm font-medium text-gray-700 min-w-[60px] text-center">
                        {zoom}%
                    </span>
                    <button
                        onClick={() => setZoom(Math.min(200, zoom + 25))}
                        disabled={zoom >= 200}
                        className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        <ZoomIn className="w-4 h-4 text-gray-700" />
                    </button>
                    <button
                        onClick={() => setZoom(100)}
                        className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                        <Maximize2 className="w-4 h-4 text-gray-700" />
                    </button>
                </div>
            </div>

            {/* Comparison Container */}
            <div
                className="relative w-full h-96 overflow-hidden cursor-ew-resize select-none"
                onMouseDown={() => setIsDragging(true)}
                onMouseUp={() => setIsDragging(false)}
                onMouseLeave={() => setIsDragging(false)}
                onMouseMove={handleMouseMove}
                onTouchStart={() => setIsDragging(true)}
                onTouchEnd={() => setIsDragging(false)}
                onTouchMove={handleTouchMove}
            >
                {/* Compressed Image (Right Side) */}
                <div className="absolute inset-0 flex items-center justify-center bg-gray-50 bg-[length:20px_20px] bg-[image:linear-gradient(45deg,#f3f4f6_25%,transparent_25%,transparent_75%,#f3f4f6_75%),linear-gradient(45deg,#f3f4f6_25%,transparent_25%,transparent_75%,#f3f4f6_75%)] bg-[position:0_0,10px_10px]">
                    <img
                        src={compressed}
                        alt="Compressed"
                        className="max-w-full max-h-full object-contain"
                        style={{ transform: `scale(${zoom / 100})` }}
                    />
                    <div className="absolute top-4 right-4 bg-black text-white px-3 py-1 rounded-full text-xs font-medium">
                        After
                    </div>
                </div>

                {/* Original Image (Left Side) - Clipped */}
                <div
                    className="absolute inset-0 flex items-center justify-center bg-gray-50 bg-[length:20px_20px] bg-[image:linear-gradient(45deg,#f3f4f6_25%,transparent_25%,transparent_75%,#f3f4f6_75%),linear-gradient(45deg,#f3f4f6_25%,transparent_25%,transparent_75%,#f3f4f6_75%)] bg-[position:0_0,10px_10px]"
                    style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
                >
                    <img
                        src={original}
                        alt="Original"
                        className="max-w-full max-h-full object-contain"
                        style={{ transform: `scale(${zoom / 100})` }}
                    />
                    <div className="absolute top-4 left-4 bg-gray-700 text-white px-3 py-1 rounded-full text-xs font-medium">
                        Before
                    </div>
                </div>

                {/* Slider Line */}
                <div
                    className="absolute top-0 bottom-0 w-1 bg-white shadow-lg z-10"
                    style={{ left: `${sliderPosition}%` }}
                >
                    {/* Slider Handle */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-white rounded-full shadow-lg border-2 border-gray-300 flex items-center justify-center cursor-ew-resize">
                        <div className="flex gap-1">
                            <div className="w-px h-4 bg-gray-400" />
                            <div className="w-px h-4 bg-gray-400" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Slider Control */}
            <div className="p-4 border-t border-gray-200">
                <input
                    type="range"
                    min="0"
                    max="100"
                    value={sliderPosition}
                    onChange={(e) => setSliderPosition(parseInt(e.target.value))}
                    className="w-full h-2 appearance-none bg-gray-200 rounded-full cursor-pointer
                     [&::-webkit-slider-thumb]:appearance-none
                     [&::-webkit-slider-thumb]:w-4
                     [&::-webkit-slider-thumb]:h-4
                     [&::-webkit-slider-thumb]:rounded-full
                     [&::-webkit-slider-thumb]:bg-black
                     [&::-webkit-slider-thumb]:cursor-pointer
                     [&::-moz-range-thumb]:w-4
                     [&::-moz-range-thumb]:h-4
                     [&::-moz-range-thumb]:rounded-full
                     [&::-moz-range-thumb]:bg-black
                     [&::-moz-range-thumb]:cursor-pointer"
                />
            </div>
        </div>
    );
}
