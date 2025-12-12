import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './CookieConsent.css';

const CookieConsent = () => {
    // 1. Inicializamos en 'false' para que no parpadee
    const [isVisible, setIsVisible] = useState(false);

    // 2. Usamos useEffect para comprobar el localStorage SOLO UNA VEZ al montar
    useEffect(() => {
        const consent = localStorage.getItem('its-stones-consent');

        // Solo mostramos el banner si NO existe la cookie
        if (!consent) {
            setIsVisible(true);
        }
    }, []); // <--- El array vacío [] es vital, asegura que solo corra una vez

    const handleAccept = (e) => {
        // Prevenir cualquier comportamiento por defecto
        e.preventDefault();
        localStorage.setItem('its-stones-consent', 'true');
        setIsVisible(false);
    };

    const handleDecline = (e) => {
        e.preventDefault();
        localStorage.setItem('its-stones-consent', 'false');
        setIsVisible(false);
    };

    // Si no es visible, devolvemos null para desmontarlo del DOM
    if (!isVisible) return null;

    return (
        <div className="cookie-consent-container">
            <div className="cookie-content-text">
                <span>
                    Valoramos su privacidad. Usamos cookies para mejorar su experiencia y analizar el tráfico conforme a la normativa internacional.
                </span>
                {/* Enlace corregido usando Link para no recargar la página */}
                <Link to="/cookie-policy" className="cookie-link">
                    Leer Política de Cookies
                </Link>
            </div>
            <div className="cookie-buttons-wrapper">
                {/* IMPORTANTE: type="button" evita que actúen como submit si hubiera un form cerca */}
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