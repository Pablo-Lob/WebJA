import React from 'react';
import './Loader.css';
import logo from '../../assets/logo.png';
import {useConfig} from '../../context/ConfigContext.jsx';

const Loader = () => {
    return (
        <div className="loader-container">
            <div className="loader-content">
                {/* Logo girando */}
                <img src={logo} alt="Cargando..." className="loader-logo" />

                {/* Barra de progreso */}
                <div className="loader-bar-container">
                    <div className="loader-bar-fill"></div>
                </div>
            </div>
        </div>
    );
};

export default Loader;