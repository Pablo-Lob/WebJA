import React from 'react';
import './About.css';
import aboutImageDefault from '../../assets/aboutUs.webp';
import { useConfig } from '../../context/ConfigContext.jsx';

const About = () => {
    const { config } = useConfig();

    // Helper para buscar en la configuración
    const getValue = (key, defaultValue) => {
        return config?.find(item => item.key === key)?.value || defaultValue;
    };

    return (
        <section id="about-us" className="about-section">
            <div className="about-container">
                <div className="about-content">
                    {/* Título dinámico */}
                    <h2 className="section-title">{getValue('about_title', 'About Us')}</h2>

                    {/* Subtítulo dinámico (opcional, si no quieres editarlo déjalo fijo) */}
                    <h3 className="section-subtitle">Forging Trust and Excellence</h3>

                    <div className="gold-divider-left"></div>

                    {/* Texto principal dinámico */}
                    <div className="about-text-content">
                        <p className="highlight-text">
                            {getValue('about_text', "Headquartered in the strategic hub of Dubai, ITS Stones is your exclusive gateway to the world's most exquisite precious metals and luxury gemstones.")}
                        </p>
                    </div>
                </div>

                <div className="about-visual">
                    <div className="visual-card">
                        {/* Imagen dinámica corregida */}
                        <img
                            src={getValue('about_image', aboutImageDefault)}
                            alt="About ITS Stones"
                            className="about-image"
                        />
                    </div>
                </div>
            </div>
        </section>
    );
};

export default About;