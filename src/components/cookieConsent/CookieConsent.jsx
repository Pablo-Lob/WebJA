import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './CookieConsent.css';

const CookieConsent = () => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // Comprobación inicial segura
        const consent = localStorage.getItem('its-stones-consent');
        if (!consent) {
            setIsVisible(true);
        }
    }, []);

    const handleAccept = () => {
        // 1. Guardar decisión
        localStorage.setItem('its-stones-consent', 'true');
        // 2. Ocultar INMEDIATAMENTE (React priorizará esto)
        setIsVisible(false);
    };

    const handleDecline = () => {
        localStorage.setItem('its-stones-consent', 'false');
        setIsVisible(false);
    };

    // Si no es visible, limpiamos el DOM
    if (!isVisible) return null;

    return (
        <div className="cookie-consent-container">
            <div className="cookie-content-text">
                <span>
                    Valoramos su privacidad. Usamos cookies para mejorar su experiencia y analizar el tráfico conforme a la normativa internacional.
                </span>
                {/* Usamos Link para navegación interna rápida */}
                <Link to="/cookie-policy" className="cookie-link">
                    Leer Política de Cookies
                </Link>
            </div>
            <div className="cookie-buttons-wrapper">
                <button type="button" onClick={handleDecline} className="cookie-btn-decline">
                    Rechazar
                </button>
                <button type="button" onClick={handleAccept} className="cookie-btn-accept">
                    Aceptar
                </button>
            </div>
        </div>
    );
};

export default CookieConsent;