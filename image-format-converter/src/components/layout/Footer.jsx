import React from 'react';
import { Heart } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="bg-white border-t border-gray-200 py-8 mt-auto">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row justify-between items-center">
                    <div className="mb-4 md:mb-0">
                        <p className="text-gray-500 text-sm">
                            © {new Date().getFullYear()} ImageConverter. All rights reserved.
                        </p>
                    </div>
                    <div className="flex items-center space-x-1 text-sm text-gray-500">
                        <span>Made with</span>
                        <Heart className="w-4 h-4 text-error-500 fill-current" />
                        <span>using React & Tailwind</span>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
