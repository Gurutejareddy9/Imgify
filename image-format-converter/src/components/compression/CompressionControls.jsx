import React from 'react';
import QualitySlider from './QualitySlider';
import { FileImage, Settings } from 'lucide-react';

export default function CompressionControls({ settings, onSettingsChange, disabled }) {
    const formats = [
        { value: 'jpeg', label: 'JPEG', description: 'Best for photos' },
        { value: 'png', label: 'PNG', description: 'Supports transparency' },
        { value: 'webp', label: 'WebP', description: 'Modern format' },
    ];

    return (
        <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-6 sticky top-24">
            {/* Header */}
            <div className="flex items-center gap-3 pb-4 border-b border-gray-200">
                <Settings className="w-5 h-5 text-gray-700" />
                <h2 className="text-lg font-semibold text-gray-900">
                    Compression Settings
                </h2>
            </div>

            {/* Quality Slider */}
            <QualitySlider
                value={settings.quality}
                onChange={(value) => onSettingsChange({ quality: value })}
                disabled={disabled}
            />

            {/* Output Format */}
            <div className="space-y-3">
                <label className="text-sm font-medium text-gray-700">
                    Output Format
                </label>
                <div className="space-y-2">
                    {formats.map((format) => (
                        <button
                            key={format.value}
                            onClick={() => onSettingsChange({ outputFormat: format.value })}
                            disabled={disabled}
                            className={`w-full flex items-center gap-3 p-3 rounded-lg border-2 transition-all
                ${settings.outputFormat === format.value
                                    ? 'border-black bg-gray-50'
                                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                                }
                disabled:opacity-50 disabled:cursor-not-allowed`}
                        >
                            <FileImage className="w-5 h-5 text-gray-700" />
                            <div className="flex-1 text-left">
                                <div className="font-semibold text-gray-900">{format.label}</div>
                                <div className="text-xs text-gray-500">{format.description}</div>
                            </div>
                            {settings.outputFormat === format.value && (
                                <div className="w-2 h-2 rounded-full bg-black" />
                            )}
                        </button>
                    ))}
                </div>
            </div>

            {/* Advanced Options (Collapsible) */}
            <details className="group">
                <summary className="cursor-pointer text-sm font-medium text-gray-700 hover:text-black transition-colors list-none flex items-center justify-between">
                    <span>Advanced Options</span>
                    <span className="text-gray-400 group-open:rotate-180 transition-transform">
                        ▼
                    </span>
                </summary>

                <div className="mt-4 space-y-4 pt-4 border-t border-gray-200">
                    {/* Max Width */}
                    <div>
                        <label className="text-sm font-medium text-gray-700 block mb-2">
                            Max Width (optional)
                        </label>
                        <input
                            type="number"
                            placeholder="e.g., 1920"
                            value={settings.maxWidth || ''}
                            onChange={(e) =>
                                onSettingsChange({
                                    maxWidth: e.target.value ? parseInt(e.target.value) : null,
                                })
                            }
                            disabled={disabled}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-gray-900 focus:ring-1 focus:ring-gray-900 transition-all disabled:bg-gray-50 disabled:cursor-not-allowed"
                        />
                    </div>

                    {/* Max Height */}
                    <div>
                        <label className="text-sm font-medium text-gray-700 block mb-2">
                            Max Height (optional)
                        </label>
                        <input
                            type="number"
                            placeholder="e.g., 1080"
                            value={settings.maxHeight || ''}
                            onChange={(e) =>
                                onSettingsChange({
                                    maxHeight: e.target.value ? parseInt(e.target.value) : null,
                                })
                            }
                            disabled={disabled}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-gray-900 focus:ring-1 focus:ring-gray-900 transition-all disabled:bg-gray-50 disabled:cursor-not-allowed"
                        />
                    </div>

                    <p className="text-xs text-gray-500">
                        Leave empty to keep original dimensions
                    </p>
                </div>
            </details>

            {/* Estimated Savings Info */}
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <div className="text-xs font-medium text-gray-700 mb-1">
                    ℹ️ Compression Info
                </div>
                <div className="text-xs text-gray-600 leading-relaxed">
                    Higher quality = larger files. Lower quality = smaller files but visible compression.
                </div>
            </div>
        </div>
    );
}
