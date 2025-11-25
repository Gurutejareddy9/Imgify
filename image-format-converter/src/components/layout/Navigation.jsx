import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navigation = ({ mobile = false, onItemClick }) => {
    const location = useLocation();

    const links = [
        { name: 'Home', path: '/' },
        { name: 'Converter', path: '/converter' }
    ];

    const baseStyles = mobile
        ? "block px-3 py-2 rounded-md text-base font-medium"
        : "text-sm font-medium transition-colors";

    return (
        <>
            {links.map(link => {
                const isActive = location.pathname === link.path;
                const activeStyles = isActive
                    ? (mobile ? "bg-primary-50 text-primary-600" : "text-primary-600")
                    : (mobile ? "text-gray-700 hover:bg-gray-50 hover:text-primary-600" : "text-gray-500 hover:text-primary-600");

                return (
                    <Link
                        key={link.path}
                        to={link.path}
                        className={`${baseStyles} ${activeStyles}`}
                        onClick={onItemClick}
                    >
                        {link.name}
                    </Link>
                );
            })}
        </>
    );
};

export default Navigation;
