import React from 'react';
import './styles/LegalPage.css';
import { useConfig } from '../context/ConfigContext';

const LegalPage = ({ id, title }) => {
    const { texts } = useConfig();

    // texts.legal puede venir vacío al principio, protegemos con ?.
    const content = texts.legal?.[id] || "<p>Contenido no disponible.</p>";

    return (
        <div className="legal-container">
            <div className="legal-content">
                <h1>{title}</h1>
                <div
                    className="legal-text"
                    dangerouslySetInnerHTML={{ __html: content }}
                />
            </div>
        </div>
    );
};

export default LegalPage;