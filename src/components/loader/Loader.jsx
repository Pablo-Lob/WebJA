import React from 'react';
import './Loader.css';
import defaultLogo from '../../assets/logo.webp';
import { useConfig } from '../../context/ConfigContext';

const Loader = ({ fadeOut }) => {
    const { config } = useConfig();

    return (
        <div className={`loader-container ${fadeOut ? 'loader-hidden' : ''}`}>
            <div className="loader-content">
                <img
                    src={config.images?.logo || defaultLogo}
                    alt="Cargando..."
                    className="loader-logo"
                />

                <div className="loader-bar-container">
                    <div className="loader-bar-fill"></div>
                </div>
            </div>
        </div>
    );
};

export default Loader;