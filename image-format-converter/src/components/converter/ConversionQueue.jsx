import React from 'react';
import { Check, Clock, AlertCircle, Loader2, Download, Trash2, RotateCcw } from 'lucide-react';
import { formatFileSize } from '../../utils/fileHelpers';
import Button from '../common/Button';

const ConversionQueue = ({ queue, onRemove, onRetry, onDownload }) => {
    if (queue.length === 0) return null;

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-900">Conversion Queue</h3>
                <span className="text-sm text-gray-500">{queue.length} items</span>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="divide-y divide-gray-100">
                    {queue.map((item) => (
                        <div key={item.sourceId} className="p-4 hover:bg-gray-50 transition-colors flex items-center justify-between group">
                            <div className="flex items-center space-x-4 flex-1 min-w-0">
                                {/* Status Icon */}
                                <div className="flex-shrink-0">
                                    {item.status === 'queued' && <Clock className="w-5 h-5 text-gray-600" />}
                                    {item.status === 'processing' && <Loader2 className="w-5 h-5 text-black animate-spin" />}
                                    {item.status === 'complete' && <Check className="w-5 h-5 text-black" />}
                                    {item.status === 'error' && <AlertCircle className="w-5 h-5 text-gray-500" />}
                                </div>

                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-gray-900 truncate">{item.originalName}</p>
                                    <div className="flex items-center text-xs text-gray-500 space-x-2">
                                        <span>{formatFileSize(item.originalSize)}</span>
                                        {item.convertedSize && (
                                            <>
                                                <span>→</span>
                                                <span className="font-medium text-gray-900">{formatFileSize(item.convertedSize)}</span>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center space-x-2 ml-4">
                                {item.status === 'complete' && (
                                    <button
                                        onClick={() => onDownload(item.sourceId)}
                                        className="p-2 text-gray-600 hover:text-black hover:bg-gray-100 rounded-lg transition-colors"
                                        title="Download"
                                    >
                                        <Download className="w-4 h-4" />
                                    </button>
                                )}
                                {item.status === 'error' && (
                                    <button
                                        onClick={() => onRetry(item.sourceId)}
                                        className="p-2 text-gray-600 hover:text-black hover:bg-gray-100 rounded-lg transition-colors"
                                        title="Retry"
                                    >
                                        <RotateCcw className="w-4 h-4" />
                                    </button>
                                )}
                                <button
                                    onClick={() => onRemove(item.sourceId)}
                                    className="p-2 text-gray-400 hover:text-black hover:bg-gray-100 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                                    title="Remove"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ConversionQueue;
