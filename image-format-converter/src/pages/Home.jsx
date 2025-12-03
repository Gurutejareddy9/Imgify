import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Layers, Minimize2, RefreshCw, ArrowRight, Shield, Zap, Image as ImageIcon } from 'lucide-react';

export default function Home() {
    const navigate = useNavigate();

    const tools = [
        {
            id: 'converter',
            title: 'Format Converter',
            description: 'Convert images to any format',
            icon: RefreshCw,
            features: 'JPG, PNG, WEBP, GIF, BMP, PDF',
            path: '/converter',
        },
        {
            id: 'compress',
            title: 'Image Compression',
            description: 'Reduce file size while maintaining quality',
            icon: Minimize2,
            features: 'Smart compression algorithms',
            path: '/compress',
        },
        {
            id: 'resize',
            title: 'Image Resize',
            description: 'Resize images by dimensions or percentage',
            icon: Layers,
            features: 'Presets for social media & print',
            path: '/resize',
        },
    ];

    const features = [
        {
            icon: Layers,
            title: 'Multiple Formats',
            description: 'Support for JPG, PNG, WEBP, GIF, and BMP.',
        },
        {
            icon: Zap,
            title: 'Batch Processing',
            description: 'Convert dozens of images at once in seconds.',
        },
        {
            icon: Shield,
            title: 'Privacy First',
            description: 'All processing happens locally. Your files never leave your device.',
        },
        {
            icon: ImageIcon,
            title: 'High Quality',
            description: 'Advanced compression algorithms to preserve detail.',
        },
    ];

    return (
        <div className="min-h-screen bg-white">
            {/* Hero Section */}
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
                <div className="text-center max-w-4xl mx-auto">
                    <h1 className="text-5xl md:text-6xl font-bold text-black mb-6">
                        Convert Images to <span className="text-gray-600">Any Format</span>
                    </h1>
                    <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                        Fast, free, and secure image format conversion in your browser. No uploads,
                        <br className="hidden md:block" />
                        no limits, just pure performance.
                    </p>
                    <button
                        onClick={() => navigate('/converter')}
                        className="btn-primary text-lg px-8 py-4 inline-flex items-center gap-2"
                    >
                        <ArrowRight className="w-5 h-5" />
                        Start Converting
                    </button>
                </div>
            </div>

            {/* Tools Section */}
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="grid md:grid-cols-3 gap-6">
                    {tools.map((tool) => {
                        const Icon = tool.icon;
                        return (
                            <button
                                key={tool.id}
                                onClick={() => navigate(tool.path)}
                                className="group text-left bg-white border-2 border-gray-200 rounded-2xl p-8 hover:border-black hover:shadow-lg transition-all duration-200"
                            >
                                <div className="w-14 h-14 bg-gray-100 rounded-xl flex items-center justify-center mb-4 group-hover:bg-black group-hover:text-white transition-all">
                                    <Icon className="w-7 h-7" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-black">
                                    {tool.title}
                                </h3>
                                <p className="text-gray-600 mb-4">{tool.description}</p>
                                <div className="text-sm text-gray-500">{tool.features}</div>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Features Section */}
            <div className="bg-gray-50 py-20">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {features.map((feature, index) => {
                            const Icon = feature.icon;
                            return (
                                <div key={index} className="text-center">
                                    <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center mx-auto mb-4 border border-gray-200">
                                        <Icon className="w-6 h-6 text-gray-700" />
                                    </div>
                                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                        {feature.title}
                                    </h3>
                                    <p className="text-sm text-gray-600 leading-relaxed">
                                        {feature.description}
                                    </p>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* CTA Section */}
            <div className="bg-black text-white py-20">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">
                        Ready to convert?
                    </h2>
                    <p className="text-gray-400 mb-8 text-lg">
                        No registration required. Start converting images instantly.
                    </p>
                    <button
                        onClick={() => navigate('/converter')}
                        className="bg-white text-black px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-all inline-flex items-center gap-2"
                    >
                        Get Started
                        <ArrowRight className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </div>
    );
}
