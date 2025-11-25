import React from 'react';

const Slider = ({ label, value, min, max, onChange, className = '' }) => {
    return (
        <div className={`w-full ${className}`}>
            <div className="flex justify-between mb-2">
                <label className="text-sm font-medium text-gray-700">{label}</label>
                <span className="text-sm text-gray-500">{value}</span>
            </div>
            <input
                type="range"
                min={min}
                max={max}
                value={value}
                onChange={(e) => onChange(Number(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary-600"
            />
        </div>
    );
};

export default Slider;
