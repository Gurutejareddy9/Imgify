import React from 'react';
import Slider from '../ui/Slider';
import Toggle from '../ui/Toggle';
import Card from '../common/Card';
import { Info } from 'lucide-react';

const FormatSettings = ({ format, settings, onUpdate }) => {
    const renderSettings = () => {
        switch (format) {
            case 'jpg':
                return (
                    <div className="space-y-6">
                        <Slider
                            label="Quality"
                            value={settings.quality}
                            min={0}
                            max={100}
                            onChange={(v) => onUpdate({ quality: v })}
                        />
                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <span className="text-sm font-medium text-gray-700 mr-2">Progressive Encoding</span>
                                <div className="group relative">
                                    <Info className="w-4 h-4 text-gray-400 cursor-help" />
                                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                                        Better for web loading
                                    </div>
                                </div>
                            </div>
                            <Toggle
                                checked={settings.progressive}
                                onChange={(v) => onUpdate({ progressive: v })}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Color Space</label>
                            <div className="flex space-x-4">
                                <label className="flex items-center space-x-2 cursor-pointer">
                                    <input
                                        type="radio"
                                        name="colorSpace"
                                        checked={settings.colorSpace !== 'grayscale'}
                                        onChange={() => onUpdate({ colorSpace: 'rgb' })}
                                        className="text-black focus:ring-black"
                                    />
                                    <span className="text-sm text-gray-600">RGB</span>
                                </label>
                                <label className="flex items-center space-x-2 cursor-pointer">
                                    <input
                                        type="radio"
                                        name="colorSpace"
                                        checked={settings.colorSpace === 'grayscale'}
                                        onChange={() => onUpdate({ colorSpace: 'grayscale' })}
                                        className="text-black focus:ring-black"
                                    />
                                    <span className="text-sm text-gray-600">Grayscale</span>
                                </label>
                            </div>
                        </div>
                    </div>
                );
            case 'png':
                return (
                    <div className="space-y-6">
                        <Toggle
                            label="Preserve Transparency"
                            checked={settings.preserveTransparency}
                            onChange={(v) => onUpdate({ preserveTransparency: v })}
                        />
                    </div>
                );
            case 'webp':
                return (
                    <div className="space-y-6">
                        <Slider
                            label="Quality"
                            value={settings.quality}
                            min={0}
                            max={100}
                            onChange={(v) => onUpdate({ quality: v })}
                        />
                    </div>
                );
            case 'pdf':
                return (
                    <div className="space-y-4">
                        {/* Page Size */}
                        <div>
                            <label className="text-sm font-medium text-gray-700 block mb-2">
                                Page Size
                            </label>
                            <select
                                value={settings.pageSize || 'a4'}
                                onChange={(e) => onUpdate({ pageSize: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-gray-900 focus:ring-1 focus:ring-gray-900"
                            >
                                <option value="a4">A4 (210 × 297 mm)</option>
                                <option value="letter">Letter (216 × 279 mm)</option>
                                <option value="legal">Legal (216 × 356 mm)</option>
                                <option value="a3">A3 (297 × 420 mm)</option>
                                <option value="a5">A5 (148 × 210 mm)</option>
                                <option value="custom">Custom Size</option>
                            </select>
                        </div>

                        {/* Orientation */}
                        <div>
                            <label className="text-sm font-medium text-gray-700 block mb-2">
                                Orientation
                            </label>
                            <div className="grid grid-cols-2 gap-2">
                                <button
                                    onClick={() => onUpdate({ orientation: 'portrait' })}
                                    className={`p-3 rounded-lg border-2 transition-all ${(settings.orientation || 'portrait') === 'portrait'
                                            ? 'border-black bg-gray-50'
                                            : 'border-gray-200 hover:border-gray-300'
                                        }`}
                                >
                                    <div className="w-12 h-16 mx-auto border-2 border-gray-400 rounded" />
                                    <div className="text-sm font-medium text-gray-900 mt-2">Portrait</div>
                                </button>
                                <button
                                    onClick={() => onUpdate({ orientation: 'landscape' })}
                                    className={`p-3 rounded-lg border-2 transition-all ${settings.orientation === 'landscape'
                                            ? 'border-black bg-gray-50'
                                            : 'border-gray-200 hover:border-gray-300'
                                        }`}
                                >
                                    <div className="w-16 h-12 mx-auto border-2 border-gray-400 rounded" />
                                    <div className="text-sm font-medium text-gray-900 mt-2">Landscape</div>
                                </button>
                            </div>
                        </div>

                        {/* Custom Size (show only if custom selected) */}
                        {settings.pageSize === 'custom' && (
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="text-sm font-medium text-gray-700 block mb-2">
                                        Width (mm)
                                    </label>
                                    <input
                                        type="number"
                                        value={settings.customWidth || 210}
                                        onChange={(e) => onUpdate({ customWidth: parseInt(e.target.value) })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-gray-900 focus:ring-1 focus:ring-gray-900"
                                        min="50"
                                        max="1000"
                                    />
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-700 block mb-2">
                                        Height (mm)
                                    </label>
                                    <input
                                        type="number"
                                        value={settings.customHeight || 297}
                                        onChange={(e) => onUpdate({ customHeight: parseInt(e.target.value) })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-gray-900 focus:ring-1 focus:ring-gray-900"
                                        min="50"
                                        max="1000"
                                    />
                                </div>
                            </div>
                        )}

                        {/* Fit to Page */}
                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div>
                                <div className="text-sm font-medium text-gray-700">Fit to Page</div>
                                <div className="text-xs text-gray-500">Scale image to fit page dimensions</div>
                            </div>
                            <Toggle
                                checked={settings.fitToPage !== false}
                                onChange={(v) => onUpdate({ fitToPage: v })}
                            />
                        </div>

                        {/* Multi-page option (for batch) */}
                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div>
                                <div className="text-sm font-medium text-gray-700">Multiple Images</div>
                                <div className="text-xs text-gray-500">Combine images into single PDF</div>
                            </div>
                            <Toggle
                                checked={settings.multiPage || false}
                                onChange={(v) => onUpdate({ multiPage: v })}
                            />
                        </div>

                        {/* Info note */}
                        <div className="bg-white border border-gray-200 rounded-lg p-3">
                            <div className="text-xs text-gray-600">
                                {settings.multiPage
                                    ? '📄 All images will be combined into one PDF file with multiple pages'
                                    : '📄 Each image will be converted to a separate PDF file'}
                            </div>
                        </div>
                    </div>
                );
            default:
                return <p className="text-sm text-gray-500">No additional settings for this format.</p>;
        }
    };

    return (
        <Card className="animate-fade-in">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Conversion Settings</h3>
            {renderSettings()}
        </Card>
    );
};

export default FormatSettings;
