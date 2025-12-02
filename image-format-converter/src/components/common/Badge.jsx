import React from 'react';

const Badge = ({ children, variant = 'primary', className = '' }) => {
    const variants = {
        primary: "bg-black text-white",
        secondary: "bg-gray-100 text-gray-800",
        success: "bg-black text-white",
        error: "bg-gray-200 text-gray-900",
        warning: "bg-gray-100 text-gray-800",
        gray: "bg-gray-50 text-gray-600"
    };

    return (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${variants[variant]} ${className}`}>
            {children}
        </span>
    );
};

export default Badge;
