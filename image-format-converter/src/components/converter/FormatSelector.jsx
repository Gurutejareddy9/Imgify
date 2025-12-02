import React from 'react';
import { Camera, Image as ImageIcon, Sparkles, Film, FileText } from 'lucide-react';

const FormatSelector = ({ selectedFormat, onSelect }) => {
    const formats = [
        { id: 'jpg', name: 'JPG', label: 'Best for photos' },
        { id: 'png', name: 'PNG', label: 'Transparency' },
        { id: 'webp', name: 'WEBP', label: 'Efficient' },
        { id: 'gif', name: 'GIF', label: 'Animation' },
        { id: 'bmp', name: 'BMP', label: 'Lossless' },
        { id: 'pdf', name: 'PDF', label: 'Document' },
    ];

    return (
        <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Select Output Format</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                {formats.map((fmt) => {
                    const isSelected = selectedFormat === fmt.id;

                    return (
                        <button
                            key={fmt.id}
                            onClick={() => onSelect(fmt.id)}
                            className={`
                relative flex flex-col items-center p-4 rounded-xl transition-all duration-200 text-left
                ${isSelected
                                    ? `border-[3px] border-black bg-white shadow-md transform scale-[1.02]`
                                    : 'bg-white border border-gray-200 hover:bg-gray-50 hover:border-gray-300 hover:shadow-md hover:scale-[1.03]'
                                }
              `}
                        >
                            <div className="p-3 mb-3">
                                {fmt.id === 'pdf' ? (
                                    <FileText className="w-10 h-10 text-gray-700" />
                                ) : (
                                    <ImageIcon className="w-10 h-10 text-gray-700" />
                                )}
                            </div>
                            <span className="text-lg font-bold text-gray-900">{fmt.name}</span>
                            <span className="text-xs text-gray-600 mt-1">{fmt.label}</span>
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

export default FormatSelector;
