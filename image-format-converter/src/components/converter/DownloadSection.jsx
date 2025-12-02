import React from 'react';
import { Archive } from 'lucide-react';
import Button from '../common/Button';
import Card from '../common/Card';

const DownloadSection = ({
    queue,
    onDownloadAll,
    onStartOver
}) => {
    const completedCount = queue.filter(i => i.status === 'complete').length;

    if (completedCount === 0) return null;

    return (
        <Card className="bg-gray-50 border border-gray-200">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Conversion Complete!</h3>
                    <p className="text-gray-600">
                        Successfully converted {completedCount} image{completedCount !== 1 ? 's' : ''}.
                    </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                    <Button
                        variant="secondary"
                        onClick={onStartOver}
                        className="w-full sm:w-auto"
                    >
                        Convert More
                    </Button>
                    <Button
                        variant="primary"
                        onClick={onDownloadAll}
                        icon={Archive}
                        className="w-full sm:w-auto"
                    >
                        Download All (ZIP)
                    </Button>
                </div>
            </div>
        </Card>
    );
};

export default DownloadSection;
