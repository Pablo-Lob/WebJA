import React from 'react';
import ReactCookieConsent from "react-cookie-consent";
import { Link } from 'react-router-dom';
import './CookieConsent.css';

const CookieConsent = () => {
    return (
        <ReactCookieConsent
            location="bottom"
            buttonText="Aceptar"
            enableDeclineButton={true} // Habilita el botón de rechazar
            declineButtonText="Rechazar"
            cookieName="its-stones-consent"

            // Asignamos las clases del CSS
            containerClasses="cookie-consent-container"
            contentClasses="cookie-content-text"
            buttonClasses="cookie-btn-accept"
            declineButtonClasses="cookie-btn-decline"
            buttonWrapperClasses="cookie-buttons-wrapper" // Importante para el layout

            expires={150}
        >
            Valoramos su privacidad. Usamos cookies para mejorar su experiencia y analizar el tráfico.
            {/* Usamos el Link de react-router para que no recargue la página */}
            <Link to="/cookie-policy" className="cookie-link">
                Leer Política de Cookies
            </Link>
        </ReactCookieConsent>
    );
};

export default CookieConsent; // <--- ESTO ES CRUCIAL PARA QUE FUNCIONE EL IMPORT