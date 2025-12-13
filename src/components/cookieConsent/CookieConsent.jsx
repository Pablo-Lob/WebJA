import React from 'react';
import CookieConsentLib from 'react-cookie-consent';
import { Link } from 'react-router-dom';

function CookieConsent() {
    return (
        <CookieConsentLib
            location="bottom"
            buttonText="Aceptar"
            declineButtonText="Rechazar"
            enableDeclineButton
            cookieName="userCookieConsent"
            style={{
                background: "rgba(0, 0, 0, 0.95)",
                padding: "20px",
                alignItems: "center",
                zIndex: 9999
            }}
            buttonStyle={{
                background: "#c9a227",
                color:  "#000",
                fontSize: "14px",
                borderRadius: "5px",
                padding:  "10px 20px",
                fontWeight: "bold"
            }}
            declineButtonStyle={{
                background: "transparent",
                border: "1px solid #c9a227",
                color: "#c9a227",
                fontSize: "14px",
                borderRadius: "5px",
                padding: "10px 20px"
            }}
            expires={365}
        >
            Utilizamos cookies para mejorar tu experiencia. Al continuar navegando, aceptas nuestra{" "}
            <Link to="/cookie-policy" style={{ color: "#c9a227" }}>
                Politica de Cookies
            </Link>
        </CookieConsentLib>
    );
}

export default CookieConsent;