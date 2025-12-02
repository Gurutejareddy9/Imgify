import React from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, X, AlertCircle } from 'lucide-react';
import { formatFileSize } from '../../utils/fileHelpers';
import Card from '../common/Card';
import Badge from '../common/Badge';

const FileUploadZone = ({
    uploadedFiles,
    onFilesAdded,
    onFileRemove,
    errors,
    maxFiles = 50
}) => {
    const onDrop = (acceptedFiles, rejectedFiles) => {
        onFilesAdded(acceptedFiles, rejectedFiles);
    };

    const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
        onDrop,
        accept: {
            'image/jpeg': [],
            'image/png': [],
            'image/gif': [],
            'image/webp': [],
            'image/bmp': [],
            'application/pdf': ['.pdf']
        },
        maxFiles: maxFiles,
        maxSize: 50 * 1024 * 1024 // 50MB
    });

    return (
        <div className="w-full space-y-6">
            <div
                {...getRootProps()}
                className={`
          relative border-2 border-dashed rounded-2xl p-8 transition-all duration-200 min-h-[320px] flex flex-col items-center justify-center cursor-pointer
          ${isDragActive && !isDragReject ? 'border-black bg-gray-200 scale-[1.01]' : 'border-gray-300 bg-gray-50 hover:border-gray-500 hover:bg-gray-100'}
          ${isDragReject ? 'border-gray-400 bg-gray-100' : ''}
        `}
            >
                <input {...getInputProps()} />

                <div className="bg-white p-4 rounded-full shadow-sm mb-4">
                    <Upload className={`w-12 h-12 ${isDragActive ? 'text-black' : 'text-gray-400'}`} />
                </div>

                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {isDragActive ? "Drop files here" : "Drag & drop images here"}
                </h3>
                <p className="text-gray-500 mb-6 text-center max-w-sm">
                    or click to browse files. Supports JPG, PNG, GIF, WEBP, BMP up to 50MB.
                </p>

                <div className="flex flex-wrap gap-2 justify-center">
                    {['JPG', 'PNG', 'GIF', 'WEBP', 'BMP', 'PDF'].map(fmt => (
                        <span key={fmt} className="px-3 py-1 rounded-full text-sm font-medium bg-gray-200 text-gray-700">{fmt}</span>
                    ))}
                </div>
            </div>

            {/* Error Toast Area */}
            {errors.length > 0 && (
                <div className="bg-gray-100 border border-gray-300 rounded-lg p-4 animate-fade-in">
                    <div className="flex items-start">
                        <AlertCircle className="w-5 h-5 text-gray-600 mt-0.5 mr-3" />
                        <div>
                            <h4 className="text-sm font-medium text-gray-900">Upload Errors</h4>
                            <ul className="mt-1 text-sm text-gray-700 list-disc list-inside">
                                {errors.map((err, idx) => (
                                    <li key={idx}>{err.file}: {err.error}</li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            )}

            {/* Thumbnails Grid */}
            {uploadedFiles.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 animate-fade-in">
                    {uploadedFiles.map((file) => (
                        <div key={file.id} className="group relative bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md hover:border-gray-300 transition-all">
                            <div className="aspect-square relative bg-gray-100">
                                <img
                                    src={file.preview}
                                    alt={file.file.name}
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                                <button
                                    onClick={(e) => { e.stopPropagation(); onFileRemove(file.id); }}
                                    className="absolute top-2 right-2 p-1.5 bg-gray-800 text-white rounded-full shadow-sm opacity-0 group-hover:opacity-100 hover:bg-black transition-all"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                                <span className="absolute bottom-2 right-2 px-2 py-1 bg-black text-white text-xs font-bold rounded shadow-sm">
                                    {file.file.type.split('/')[1].toUpperCase()}
                                </span>
                            </div>
                            <div className="p-3">
                                <p className="text-sm font-medium text-gray-900 truncate" title={file.file.name}>
                                    {file.file.name}
                                </p>
                                <p className="text-xs text-gray-500 mt-1">
                                    {formatFileSize(file.file.size)}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default FileUploadZone;
