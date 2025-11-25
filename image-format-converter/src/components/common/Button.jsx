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
        primary: "bg-gradient-to-r from-primary-500 to-secondary-500 text-white shadow-md hover:shadow-lg hover:scale-[1.02] focus:ring-primary-500",
        secondary: "bg-white text-primary-600 border-2 border-primary-300 hover:bg-primary-50 focus:ring-primary-500",
        danger: "bg-error-500 text-white hover:bg-error-600 focus:ring-error-500",
        ghost: "bg-transparent text-gray-600 hover:bg-gray-100 focus:ring-gray-500"
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
