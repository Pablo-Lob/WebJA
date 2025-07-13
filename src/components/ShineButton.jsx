import React from 'react';
import './ShineButton.css';

const ShineButton = ({ children, ...props }) => (
    <button className="shine-btn" {...props}>
        {children}
    </button>
);

export default ShineButton;