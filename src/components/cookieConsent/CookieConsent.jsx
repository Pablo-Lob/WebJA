import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './CookieConsent.css';
import { useConfig } from '../../context/ConfigContext.jsx'; // Importamos hook

const CookieConsent = () => {
    const [isVisible, setIsVisible] = useState(false);
    const { config } = useConfig();

    const getValue = (key, defaultValue) => {
        return config?.find(item => item.key === key)?.value || defaultValue;
    };

    useEffect(() => {
        const consent = localStorage.getItem('cookieConsent');
        if (!consent) {
            setIsVisible(true);
        }
    }, []);

    const handleAccept = () => {
        localStorage.setItem('cookieConsent', 'true');
        setIsVisible(false);
    };

    if (!isVisible) return null;

    return (
        <div className="cookie-consent-banner">
            <div className="cookie-content">
                <p>
                    {getValue('cookie_banner_text', 'Utilizamos cookies propias y de terceros para mejorar su experiencia. Si continúa navegando, consideramos que acepta su uso.')}
                    <Link to="/cookie-policy" className="cookie-link"> Más información</Link>.
                </p>
                <button onClick={handleAccept} className="cookie-accept-btn">
                    Aceptar Cookies
                </button>
            </div>
        </div>
    );
};

export default CookieConsent;