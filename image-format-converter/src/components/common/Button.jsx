import React from 'react';

const Button = ({
    children,
    variant = 'primary',
    size = 'md',
    className = '',
    disabled = false,
    onClick,
    type = 'button',
    icon: Icon
}) => {
    const baseStyles = "inline-flex items-center justify-center rounded-lg font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";

    const variants = {
        primary: "bg-black text-white shadow-md hover:bg-gray-900 hover:shadow-lg hover:scale-[1.02] focus:ring-gray-900",
        secondary: "bg-white text-black border-2 border-gray-300 hover:bg-gray-50 hover:border-gray-400 focus:ring-gray-900",
        danger: "bg-gray-900 text-white hover:bg-black focus:ring-gray-900",
        ghost: "bg-transparent text-gray-700 hover:bg-gray-100 focus:ring-gray-500"
    };

    const sizes = {
        sm: "px-3 py-1.5 text-sm",
        md: "px-6 py-3 text-base",
        lg: "px-8 py-4 text-lg"
    };

    return (
        <button
            type={type}
            className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
            disabled={disabled}
            onClick={onClick}
        >
            {Icon && <Icon className={`w-5 h-5 ${children ? 'mr-2' : ''}`} />}
            {children}
        </button>
    );
};

export default Button;
