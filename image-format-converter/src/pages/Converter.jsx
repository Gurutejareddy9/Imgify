import React, { useState, useEffect } from 'react';
import { ArrowLeft, ArrowRight, RotateCcw } from 'lucide-react';
import { useFileUpload } from '../hooks/useFileUpload';
import { useImageConverter } from '../hooks/useImageConverter';
import FileUploadZone from '../components/converter/FileUploadZone';
import FormatSelector from '../components/converter/FormatSelector';
import FormatSettings from '../components/converter/FormatSettings';
import ImagePreview from '../components/converter/ImagePreview';
import ConversionQueue from '../components/converter/ConversionQueue';
import DownloadSection from '../components/converter/DownloadSection';
import Button from '../components/common/Button';

const Converter = () => {
    const [step, setStep] = useState(1);
    const { uploadedFiles, errors, handleFiles, removeFile, clearFiles } = useFileUpload();
    const {
        targetFormat,
        setTargetFormat,
        settings,
        updateSettings,
        convertAllFiles,
        conversionQueue,
        isProcessing,
        progress,
        downloadConverted,
        downloadAllAsZIP,
        reset: resetConverter,
        addFiles: addFilesToConverter
    } = useImageConverter();

    // Sync uploaded files to converter hook when moving to step 2
    const handleStep1Next = () => {
        resetConverter();
        addFilesToConverter(uploadedFiles);
        setStep(2);
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            {/* Progress Stepper */}
            <div className="mb-12">
                <div className="flex items-center justify-center space-x-4">
                    {[1, 2, 3].map((s) => (
                        <div key={s} className="flex items-center">
                            <div className={`
                w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg transition-colors
                ${step >= s ? 'bg-black text-white' : 'bg-gray-300 text-gray-400'}
              `}>
                                {s}
                            </div>
                            {s < 3 && (
                                <div className={`w-16 h-1 bg-gray-200 ml-4 ${step > s ? 'bg-black' : ''}`} />
                            )}
                        </div>
                    ))}
                </div>
                <div className="flex justify-center space-x-20 mt-2 text-sm font-medium text-gray-600">
                    <span>Upload</span>
                    <span>Format</span>
                    <span>Convert</span>
                </div>
            </div>

            {/* Step 1: Upload */}
            {step === 1 && (
                <div className="max-w-4xl mx-auto animate-fade-in">
                    <FileUploadZone
                        uploadedFiles={uploadedFiles}
                        onFilesAdded={handleFiles}
                        onFileRemove={removeFile}
                        errors={errors}
                    />
                    <div className="mt-8 flex justify-end">
                        <Button
                            onClick={handleStep1Next}
                            disabled={uploadedFiles.length === 0}
                            icon={ArrowRight}
                        >
                            Next Step
                        </Button>
                    </div>
                </div>
            )}

            {/* Step 2: Format & Settings */}
            {step === 2 && (
                <div className="max-w-4xl mx-auto animate-fade-in">
                    <div className="grid gap-8">
                        <FormatSelector
                            selectedFormat={targetFormat}
                            onSelect={setTargetFormat}
                        />
                        <FormatSettings
                            format={targetFormat}
                            settings={settings}
                            onUpdate={updateSettings}
                        />
                    </div>
                    <div className="mt-8 flex justify-between">
                        <Button
                            variant="secondary"
                            onClick={() => setStep(1)}
                            icon={ArrowLeft}
                        >
                            Back
                        </Button>
                        <Button
                            onClick={() => {
                                setStep(3);
                                // We need to wait for state update? No, addFilesToConverter was called in Step 1.
                                // But we should ensure files are there.
                                setTimeout(() => convertAllFiles(), 100);
                            }}
                            icon={ArrowRight}
                        >
                            Start Conversion
                        </Button>
                    </div>
                </div>
            )}

            {/* Step 3: Conversion & Download */}
            {step === 3 && (
                <div className="max-w-5xl mx-auto animate-fade-in space-y-8">
                    {/* Progress Bar */}
                    {isProcessing && (
                        <div className="w-full bg-gray-200 rounded-full h-2.5 mb-6">
                            <div
                                className="bg-black h-2.5 rounded-full transition-all duration-300"
                                style={{ width: `${progress}%` }}
                            ></div>
                        </div>
                    )}

                    <div className="grid lg:grid-cols-2 gap-8">
                        <div className="space-y-8">
                            <ConversionQueue
                                queue={conversionQueue}
                                onRemove={(id) => { }}
                                onRetry={() => { }}
                                onDownload={downloadConverted}
                            />
                            <DownloadSection
                                queue={conversionQueue}
                                onDownloadAll={downloadAllAsZIP}
                                onStartOver={() => {
                                    clearFiles();
                                    resetConverter();
                                    setStep(1);
                                }}
                            />
                        </div>

                        <div>
                            {/* Show preview of the first completed item or the first item being processed */}
                            {conversionQueue.length > 0 && (
                                <ImagePreview
                                    originalFile={uploadedFiles.find(f => f.id === conversionQueue[0].sourceId)}
                                    convertedFile={conversionQueue[0].result}
                                />
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Converter;
