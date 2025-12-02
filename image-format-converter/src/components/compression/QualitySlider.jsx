import React from 'react';

export default function QualitySlider({ value, onChange, disabled }) {
    const getQualityLabel = (val) => {
        if (val <= 30) return 'Low';
        if (val <= 60) return 'Medium';
        if (val <= 85) return 'High';
        return 'Maximum';
    };

    const getQualityColor = (val) => {
        if (val <= 30) return 'text-gray-500';
        if (val <= 60) return 'text-gray-600';
        if (val <= 85) return 'text-gray-800';
        return 'text-black';
    };

    return (
        <div className="space-y-3">
            <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-700">
                    Compression Quality
                </label>
                <div className="flex items-center gap-2">
                    <span className={`text-2xl font-bold ${getQualityColor(value)}`}>
                        {value}%
                    </span>
                    <span className="text-sm text-gray-500">
                        ({getQualityLabel(value)})
                    </span>
                </div>
            </div>

            <div className="relative">
                {/* Slider track with gradient */}
                <div className="absolute inset-0 h-2 bg-gray-200 rounded-full" />
                <div
                    className="absolute inset-0 h-2 bg-black rounded-full transition-all duration-200"
                    style={{ width: `${value}%` }}
                />

                {/* Slider input */}
                <input
                    type="range"
                    min="10"
                    max="100"
                    step="5"
                    value={value}
                    onChange={(e) => onChange(parseInt(e.target.value))}
                    disabled={disabled}
                    className="relative w-full h-2 appearance-none bg-transparent cursor-pointer
                     [&::-webkit-slider-thumb]:appearance-none
                     [&::-webkit-slider-thumb]:w-5
                     [&::-webkit-slider-thumb]:h-5
                     [&::-webkit-slider-thumb]:rounded-full
                     [&::-webkit-slider-thumb]:bg-black
                     [&::-webkit-slider-thumb]:border-2
                     [&::-webkit-slider-thumb]:border-white
                     [&::-webkit-slider-thumb]:shadow-md
                     [&::-webkit-slider-thumb]:cursor-pointer
                     [&::-webkit-slider-thumb]:transition-transform
                     [&::-webkit-slider-thumb]:hover:scale-110
                     [&::-moz-range-thumb]:w-5
                     [&::-moz-range-thumb]:h-5
                     [&::-moz-range-thumb]:rounded-full
                     [&::-moz-range-thumb]:bg-black
                     [&::-moz-range-thumb]:border-2
                     [&::-moz-range-thumb]:border-white
                     [&::-moz-range-thumb]:shadow-md
                     [&::-moz-range-thumb]:cursor-pointer
                     disabled:opacity-50
                     disabled:cursor-not-allowed"
                />

                {/* Quality markers */}
                <div className="flex justify-between mt-2 px-1">
                    {[25, 50, 75, 100].map((mark) => (
                        <div key={mark} className="flex flex-col items-center">
                            <div className="w-px h-2 bg-gray-300" />
                            <span className="text-xs text-gray-400 mt-1">{mark}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Quality description */}
            <div className="text-xs text-gray-500 leading-relaxed">
                {value <= 30 && 'Smallest file size, visible quality loss'}
                {value > 30 && value <= 60 && 'Balanced compression with good quality'}
                {value > 60 && value <= 85 && 'High quality with moderate compression'}
                {value > 85 && 'Best quality, minimal compression'}
            </div>
        </div>
    );
}
