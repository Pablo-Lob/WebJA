import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './CookieConsent.css';

const CookieConsent = () => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const consent = localStorage.getItem('its-stones-consent');
        // Si no existe la cookie (es null), mostramos el banner
        if (!consent) {
            setIsVisible(true);
        }
    }, []);

    const handleAccept = () => {
        localStorage.setItem('its-stones-consent', 'true');
        setIsVisible(false);
    };

    const handleDecline = () => {
        localStorage.setItem('its-stones-consent', 'false');
        setIsVisible(false);
    };

    if (!isVisible) return null;

    return (
        <div className="cookie-consent-container">
            <div className="cookie-content-text">
                Valoramos su privacidad. Usamos cookies para mejorar su experiencia y analizar el tráfico conforme a la normativa internacional.
                <Link to="/cookie-policy" className="cookie-link">
                    Leer Política de Cookies
                </Link>
            </div>
            <div className="cookie-buttons-wrapper">
                <button onClick={handleDecline} className="cookie-btn-decline">
                    Rechazar
                </button>
                <button onClick={handleAccept} className="cookie-btn-accept">
                    Aceptar
                </button>
            </div>
        </div>
    );
};

export default CookieConsent;