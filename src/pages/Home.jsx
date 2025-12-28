import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import './styles/Home.css';
import ShineButton from '../components/shineButton/ShineButton.jsx';
import ContactForm from "../components/contactForm/ContactForm.jsx";
import banner from '../assets/banner.webp';
import Branches from "../components/branches/Branches.jsx";
import About from "../components/about/About.jsx";
import Services from "../components/services/Services.jsx";
import Mission from "../components/mission/Mission.jsx";
import { useConfig } from "../context/ConfigContext.jsx";
import {ParallaxProvider, Parallax} from 'react-scroll-parallax';

function Home() {
    const { config, loading } = useConfig();
    const location = useLocation();

    // Helper para obtener datos de la BD o usar el texto original por defecto
    const getValue = (key, defaultValue) => {
        if (!config || !Array.isArray(config)) return defaultValue;
        const item = config.find(item => item.key === key);
        return item ? item.value : defaultValue;
    };

    // Lógica para detectar si venimos de otra página y hacer scroll
    useEffect(() => {
        if (location.state && location.state.targetId) {
            const targetId = location.state.targetId;

            if (targetId === 'home') {
                window.scrollTo({ top: 0, behavior: 'smooth' });
            } else {
                const element = document.getElementById(targetId);
                if (element) {
                    element.scrollIntoView({ behavior: 'smooth' });
                }
            }
        }
    }, [location]);

    if (loading) return <div className="loader-placeholder"></div>;

    return (
        <>
            {/* Hero Section */}
            <ParallaxProvider>
            <section id="home" className="hero-home">
                <div className="hero-image">
                    {/* Imagen dinámica con fallback a tu banner original */}
                    <Parallax speed={-20}>
                    <img src={getValue('hero_image', banner)} alt="ITS-STONES Banner" />
                    </Parallax>
                </div>
                <div className="hero-content">
                    {/* Títulos dinámicos */}
                    <h1>{getValue('hero_title', 'ITS-STONES')}</h1>
                    <h2>{getValue('hero_subtitle', 'Precious Metals & Gems Import')}</h2>
                    <p>
                        {getValue('hero_text', 'Discover the difference of trading with integrity and excellence.')}
                    </p>

                    {/* Tu ShineButton original pero con texto editable */}
                    <ShineButton href="#contact">
                        {getValue('hero_cta_text', 'Contact us')}
                    </ShineButton>
                </div>
            </section>
            </ParallaxProvider>

            {/* About us Section */}
            <section id="about-us" className="about-home">
                <About/>
            </section>

            {/* Services Section */}
            <section id="services" className="services-home">
                <Services />
            </section>

            {/* Mission Section */}
            <section id="mission" className="mission-home">
                <Mission />
            </section>

            {/* Branches */}
            <section id="branches" className="branches-section">
                <Branches />
            </section>

            {/* Contacto */}
            <section id="contact" className="contact-home">
                <ContactForm />
            </section>
            {/* Footer */}
        </>
    );
}

export default Home;