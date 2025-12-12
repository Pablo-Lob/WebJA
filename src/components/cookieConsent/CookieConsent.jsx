import React, { useRef } from 'react'; // Eliminamos useState para evitar bucles
import { Link } from 'react-router-dom';
import './CookieConsent.css';

const CookieConsent = () => {
    // Usamos useRef para acceder directamente al elemento HTML
    const bannerRef = useRef(null);

    // Comprobación inicial síncrona (se ejecuta antes de pintar nada)
    const hasConsent = localStorage.getItem('its-stones-consent');

    // Si ya hay consentimiento, no renderizamos nada directamente
    if (hasConsent) return null;

    const hideBanner = () => {
        if (bannerRef.current) {
            bannerRef.current.style.display = 'none';
        }
    };

    const handleAccept = () => {
        localStorage.setItem('its-stones-consent', 'true');
        hideBanner();
    };

    const handleDecline = () => {
        localStorage.setItem('its-stones-consent', 'false');
        hideBanner();
    };

    return (
        <div
            ref={bannerRef}
            className="cookie-consent-container"
            style={{ display: 'flex' }}
        >
            <div className="cookie-content-text">
                <span>
                    We value your privacy. We use cookies to improve your experience and analyze traffic in accordance with international regulations.
                </span>
                <Link to="/cookie-policy" className="cookie-link">
                    Leer Política de Cookies
                </Link>
            </div>
            <div className="cookie-buttons-wrapper">
                <button type="button" onClick={handleDecline} className="cookie-btn-decline">
                    Decline
                </button>
                <button type="button" onClick={handleAccept} className="cookie-btn-accept">
                    Accept
                </button>
            </div>
        </div>
    );
};

export default CookieConsent;