import React from 'react';
import './About.css';
import aboutUs from '../../assets/aboutUs.webp';

const About = () => {
    return (
        <section id="about-us" className="about-section">
            <div className="about-container">
                <div className="about-content">
                    <h2 className="section-title">About Us</h2>
                    <h3 className="section-subtitle">Forging Trust and Excellence</h3>

                    <div className="gold-divider-left"></div>

                    <p className="highlight-text">
                        Headquartered in the strategic hub of Dubai, ITS Stones is your exclusive gateway
                        to the world's most exquisite precious metals and luxury gemstones.
                    </p>

                    <p>
                        We are the dedicated intermediary ensuring that Earth’s inherent riches
                        are delivered to the international market with uncompromising ethical
                        standards and logistical mastery.
                    </p>
                </div>

                <div className="about-visual">
                    <div className="visual-card">
                        <img src={aboutUs}  alt="Manos sosteniendo piedras preciosas y metales preciosos"  className="about-image"/>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default About;