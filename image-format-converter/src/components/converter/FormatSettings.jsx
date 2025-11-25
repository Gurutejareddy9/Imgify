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
                                        className="text-primary-600 focus:ring-primary-500"
                                    />
                                    <span className="text-sm text-gray-600">RGB</span>
                                </label>
                                <label className="flex items-center space-x-2 cursor-pointer">
                                    <input
                                        type="radio"
                                        name="colorSpace"
                                        checked={settings.colorSpace === 'grayscale'}
                                        onChange={() => onUpdate({ colorSpace: 'grayscale' })}
                                        className="text-primary-600 focus:ring-primary-500"
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
