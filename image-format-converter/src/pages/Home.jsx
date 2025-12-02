import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Image, Layers, Shield, Zap } from 'lucide-react';
import Button from '../components/common/Button';

const Home = () => {
    return (
        <div className="space-y-20 pb-20">
            {/* Hero Section */}
            <section className="relative overflow-hidden pt-20 pb-16 md:pt-32 md:pb-24">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h1 className="text-4xl md:text-6xl font-bold text-black tracking-tight mb-6">
                        Convert Images to <span className="text-gray-600">Any Format</span>
                    </h1>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-10">
                        Fast, free, and secure image format conversion in your browser. No uploads, no limits, just pure performance.
                    </p>
                    <div className="flex justify-center gap-4">
                        <Link to="/converter">
                            <Button size="lg" icon={ArrowRight}>Start Converting</Button>
                        </Link>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {[
                        { icon: Layers, title: 'Multiple Formats', desc: 'Support for JPG, PNG, WEBP, GIF, and BMP.' },
                        { icon: Zap, title: 'Batch Processing', desc: 'Convert dozens of images at once in seconds.' },
                        { icon: Shield, title: 'Privacy First', desc: 'All processing happens locally. Your files never leave your device.' },
                        { icon: Image, title: 'High Quality', desc: 'Advanced compression algorithms to preserve detail.' }
                    ].map((feature, idx) => (
                        <div key={idx} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                            <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center mb-4">
                                <feature.icon className="w-6 h-6 text-gray-700" />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                            <p className="text-gray-600">{feature.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* How It Works */}
            <section className="bg-gray-50 py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">How It Works</h2>
                    <div className="grid md:grid-cols-3 gap-8 relative">
                        {[
                            { step: '01', title: 'Upload Images', desc: 'Drag & drop your files or select them from your device.' },
                            { step: '02', title: 'Choose Format', desc: 'Select your desired output format and adjust quality settings.' },
                            { step: '03', title: 'Convert & Download', desc: 'Get your converted files instantly, individually or as a ZIP.' }
                        ].map((item, idx) => (
                            <div key={idx} className="relative z-10">
                                <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200 text-center h-full flex flex-col items-center">
                                    <div className="w-12 h-12 bg-black text-white rounded-full flex items-center justify-center font-bold text-xl mb-6 shadow-md">
                                        {item.step}
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-900 mb-4">{item.title}</h3>
                                    <p className="text-gray-600">{item.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="bg-gray-900 rounded-3xl p-12 text-center text-white shadow-xl">
                    <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to convert your images?</h2>
                    <p className="text-gray-400 text-lg mb-8 max-w-2xl mx-auto">
                        No registration required. Unlimited conversions. 100% Free.
                    </p>
                    <Link to="/converter">
                        <button className="bg-white text-black border border-black px-8 py-4 rounded-xl font-bold text-lg hover:bg-gray-100 transition-colors shadow-lg">
                            Start Converting Now
                        </button>
                    </Link>
                </div>
            </section>
        </div>
    );
};

export default Home;
