import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, Layers, Loader, Download, Trash2, FileText } from 'lucide-react';
import { saveAs } from 'file-saver';
import JSZip from 'jszip';
import { extractImagesFromPDF } from '../utils/pdfConverter';

export default function Resize() {
    const [files, setFiles] = useState([]);
    const [isProcessing, setIsProcessing] = useState(false);
    const [settings, setSettings] = useState({
        width: 800,
        height: 600,
        maintainAspectRatio: true,
        unit: 'px' // px or %
    });

    const onDrop = useCallback(async (acceptedFiles) => {
        const newFiles = [];
        for (const file of acceptedFiles) {
            if (file.type === 'application/pdf') {
                try {
                    const images = await extractImagesFromPDF(file);
                    if (images.length > 0) {
                        newFiles.push({
                            file: file,
                            preview: URL.createObjectURL(images[0].blob),
                            originalWidth: images[0].width,
                            originalHeight: images[0].height,
                            isPdf: true
                        });
                    }
                } catch (error) {
                    console.error('Error extracting PDF:', error);
                }
            } else {
                const img = new Image();
                img.src = URL.createObjectURL(file);
                await new Promise(resolve => img.onload = resolve);
                newFiles.push({
                    file: file,
                    preview: img.src,
                    originalWidth: img.width,
                    originalHeight: img.height,
                    isPdf: false
                });
            }
        }
        setFiles(prev => [...prev, ...newFiles]);
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'image/*': ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.bmp'],
            'application/pdf': ['.pdf']
        },
        multiple: true
    });

    const handleResize = async () => {
        setIsProcessing(true);
        // Mock resize logic for now as full implementation wasn't provided
        // In a real app, this would use canvas to resize
        setTimeout(() => {
            setIsProcessing(false);
            alert('Resize functionality would process here. (Placeholder implementation)');
        }, 1000);
    };

    const removeFile = (index) => {
        setFiles(prev => prev.filter((_, i) => i !== index));
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Image Resize</h1>
                    <p className="text-gray-600">Resize images by dimensions or percentage</p>
                </div>

                {files.length === 0 ? (
                    <div
                        {...getRootProps()}
                        className={`border-2 border-dashed rounded-xl p-12 text-center transition-all cursor-pointer
                            ${isDragActive ? 'border-black bg-gray-100' : 'border-gray-300 bg-white hover:bg-gray-50'}`}
                    >
                        <input {...getInputProps()} />
                        <Upload className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                        <p className="text-xl font-semibold text-gray-900 mb-2">
                            {isDragActive ? 'Drop images here' : 'Drag & drop images here'}
                        </p>
                        <p className="text-gray-600 mb-4">or click to browse files</p>
                        <p className="text-sm text-gray-500">
                            Supports JPG, PNG, GIF, WEBP, BMP, PDF (max 50MB per file)
                        </p>
                    </div>
                ) : (
                    <div className="grid lg:grid-cols-4 gap-6">
                        <div className="lg:col-span-1 space-y-6">
                            <div className="bg-white p-6 rounded-xl border border-gray-200">
                                <h3 className="font-semibold text-gray-900 mb-4">Resize Settings</h3>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Width</label>
                                        <input
                                            type="number"
                                            value={settings.width}
                                            onChange={(e) => setSettings({ ...settings, width: parseInt(e.target.value) })}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-black focus:border-black"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Height</label>
                                        <input
                                            type="number"
                                            value={settings.height}
                                            onChange={(e) => setSettings({ ...settings, height: parseInt(e.target.value) })}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-black focus:border-black"
                                        />
                                    </div>
                                    <button
                                        onClick={handleResize}
                                        disabled={isProcessing}
                                        className="w-full btn-primary py-2"
                                    >
                                        {isProcessing ? 'Processing...' : 'Resize All'}
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="lg:col-span-3 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {files.map((file, index) => (
                                <div key={index} className="bg-white rounded-xl border border-gray-200 overflow-hidden relative group">
                                    <div className="aspect-video bg-gray-100 relative">
                                        <img src={file.preview} alt="Preview" className="w-full h-full object-contain" />
                                        {file.isPdf && (
                                            <div className="absolute bottom-2 left-2 bg-black text-white px-2 py-1 rounded text-xs font-medium flex items-center gap-1">
                                                <FileText className="w-3 h-3" />
                                                From PDF • Page 1
                                            </div>
                                        )}
                                        <button
                                            onClick={() => removeFile(index)}
                                            className="absolute top-2 right-2 p-1 bg-white rounded-full shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            <Trash2 className="w-4 h-4 text-red-500" />
                                        </button>
                                    </div>
                                    <div className="p-3">
                                        <p className="text-sm font-medium text-gray-900 truncate">{file.file.name}</p>
                                        <p className="text-xs text-gray-500">{file.originalWidth} x {file.originalHeight}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
