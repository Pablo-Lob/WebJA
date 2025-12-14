import React from 'react';
import './ShineButton.css';

const ShineButton = ({ children, href, ...props }) => {
    // Si hay 'href', renderizamos un enlace <a>
    if (href) {
        return (
            <a href={href} className="shine-btn" {...props}>
                {children}
            </a>
        );
    }

    // Si no, renderizamos un botón normal
    return (
        <button className="shine-btn" {...props}>
            {children}
        </button>
    );
};

export default ShineButton;