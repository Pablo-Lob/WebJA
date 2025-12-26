import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './CookieConsent.css';

const CookieConsent = () => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // Comprobamos si ya aceptó las cookies antes
        const consent = localStorage.getItem('cookieConsent');
        if (!consent) {
            setIsVisible(true);
        }
    }, []);

    const handleAccept = () => {
        // Guardamos la decisión para que no vuelva a salir
        localStorage.setItem('cookieConsent', 'true');
        setIsVisible(false);
    };

    if (!isVisible) return null;

    return (
        <div className="cookie-consent-banner">
            <div className="cookie-content">
                <p>
                    Utilizamos cookies propias y de terceros para mejorar su experiencia.
                    Si continúa navegando, consideramos que acepta su uso.
                    <Link to="/cookie-policy" className="cookie-link">Más información</Link>.
                </p>
                <button onClick={handleAccept} className="cookie-accept-btn">
                    Aceptar Cookies
                </button>
            </div>
        </div>
    );
};

export default CookieConsent;