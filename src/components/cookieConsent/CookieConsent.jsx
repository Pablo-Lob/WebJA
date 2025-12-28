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

    const handleDeny = () => {
        localStorage.setItem('cookieConsent', 'false');
        setIsVisible(false);
    }

    if (!isVisible) return null;

    return (
        <div className="cookie-consent-banner">
            <div className="cookie-content">
                <p>
                    {getValue('cookie_banner_text', 'We use our own and third-party cookies to improve your experience. By continuing to browse, you agree to their use.')}
                    <Link to="/cookie-policy" className="cookie-link"> More information</Link>.
                </p>
                <button onClick={handleAccept} className="cookie-btn">
                    Accept Cookies
                </button>
                <button onClick={handleDeny} className="cookie-btn">
                    Deny Cookies
                </button>
            </div>
        </div>
    );
};

export default CookieConsent;