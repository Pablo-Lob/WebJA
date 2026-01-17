import React from 'react';
import './About.css';
import aboutImageDefault from '../../assets/aboutUs.webp';
import { useConfig } from '../../context/ConfigContext.jsx';
import personAbout from '../../assets/hombreCitacion.webp';

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

                    {/* Subtítulo dinámico */}
                    <h3 className="section-subtitle">Forging Trust and Excellence</h3>

                    <div className="gold-divider-left"></div>

                    {/* Texto principal dinámico */}
                    <div className="about-text-content">
                        <div className="person">
                            <img
                                src={getValue('about_person', personAbout)}
                                alt={`Portrait of ${getValue('about_person_name', 'Jeyakumar J.')}`}
                                className="about-person-image"
                            />
                            <div className="person-text">
                                <p className="name-person-about">
                                    {getValue('about_person_name', 'Jeyakumar J.')}
                                </p>
                                <p className="job-tittle-person-about">
                                    {getValue('about_person_job', 'Head of Sales Department')}
                                </p>
                            </div>
                        </div>
                        <p className="highlight-text">
                            {getValue('about_text', '"ITS-Stones is a premier global trading house specializing in the sourcing and importation of precious metals and high-grade gemstones. With decades of combined experience, we bridge the gap between ethically managed mines in Africa and South America and the world’s most demanding markets."')}
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