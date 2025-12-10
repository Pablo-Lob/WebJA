import React from 'react';
import './Loader.css';
import defaultLogo from '../../assets/logo.webp'; // Asegúrate que sea .webp
import { useConfig } from '../../context/ConfigContext';

const Loader = () => {
    const { config } = useConfig();

    return (
        <div className="loader-container">
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