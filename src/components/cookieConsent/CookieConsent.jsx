// src/components/cookieConsent/CookieConsent.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './CookieConsent.css';

const CookieConsent = () => {
    // Inicializamos en false para evitar parpadeos, luego comprobamos en useEffect
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const consent = localStorage.getItem('its-stones-consent');
        // Solo mostramos si NO hay nada guardado en localStorage
        if (consent === null) {
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

    // Si no es visible, no renderizamos nada (return null desmonta el componente)
    if (!isVisible) return null;

    return (
        <div className="cookie-consent-container">
            <div className="cookie-content-text">
                <p style={{ margin: 0, display: 'inline' }}>
                    Valoramos su privacidad. Usamos cookies para mejorar su experiencia.
                </p>
                {/* Asegúrate de que esta ruta coincida con App.jsx */}
                <Link to="/cookie-policy" className="cookie-link">
                    Leer Política de Cookies
                </Link>
            </div>
            <div className="cookie-buttons-wrapper">
                {/* type="button" previene comportamientos raros de submit si estuviera en un form */}
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