import React from 'react';
import { Camera, Image as ImageIcon, Sparkles, Film, FileText } from 'lucide-react';

const FormatSelector = ({ selectedFormat, onSelect }) => {
    const formats = [
        { id: 'jpg', name: 'JPG', label: 'Best for photos', icon: Camera, color: 'text-orange-500', bg: 'bg-orange-50', border: 'border-orange-200' },
        { id: 'png', name: 'PNG', label: 'Transparency', icon: ImageIcon, color: 'text-blue-500', bg: 'bg-blue-50', border: 'border-blue-200' },
        { id: 'webp', name: 'WEBP', label: 'Efficient', icon: Sparkles, color: 'text-green-500', bg: 'bg-green-50', border: 'border-green-200' },
        { id: 'gif', name: 'GIF', label: 'Animation', icon: Film, color: 'text-purple-500', bg: 'bg-purple-50', border: 'border-purple-200' },
        { id: 'bmp', name: 'BMP', label: 'Lossless', icon: FileText, color: 'text-gray-500', bg: 'bg-gray-50', border: 'border-gray-200' },
    ];

    return (
        <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Select Output Format</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                {formats.map((fmt) => {
                    const Icon = fmt.icon;
                    const isSelected = selectedFormat === fmt.id;

                    return (
                        <button
                            key={fmt.id}
                            onClick={() => onSelect(fmt.id)}
                            className={`
                relative flex flex-col items-center p-4 rounded-xl transition-all duration-200 text-left
                ${isSelected
                                    ? `ring-2 ring-primary-500 bg-white shadow-md transform scale-[1.02]`
                                    : 'bg-white border border-gray-200 hover:border-primary-300 hover:shadow-sm'
                                }
              `}
                        >
                            <div className={`p-3 rounded-full mb-3 ${fmt.bg}`}>
                                <Icon className={`w-6 h-6 ${fmt.color}`} />
                            </div>
                            <span className="text-lg font-bold text-gray-900">{fmt.name}</span>
                            <span className="text-xs text-gray-500 mt-1">{fmt.label}</span>

                            {isSelected && (
                                <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-primary-500" />
                            )}
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

export default FormatSelector;
