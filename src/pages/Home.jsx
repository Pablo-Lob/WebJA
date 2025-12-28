import React, { useEffect, useState } from 'react'; // <--- Importamos useState
import { useLocation } from 'react-router-dom';
// NOTA: SI habías importado 'react-scroll-parallax', BORRA ESA LÍNEA.
import './styles/Home.css';
import ShineButton from '../components/shineButton/ShineButton.jsx';
import ContactForm from "../components/contactForm/ContactForm.jsx";
import banner from '../assets/banner.webp';
import Branches from "../components/branches/Branches.jsx";
import About from "../components/about/About.jsx";
import Services from "../components/services/Services.jsx";
import Mission from "../components/mission/Mission.jsx";
import { useConfig } from "../context/ConfigContext.jsx";

function Home() {
    const { config, loading } = useConfig();
    const location = useLocation();

    // --- LÓGICA PARALLAX MANUAL (SUTIL) ---
    const [offsetY, setOffsetY] = useState(0);
    const handleScroll = () => setOffsetY(window.scrollY);

    useEffect(() => {
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);
    // --------------------------------------

    const getValue = (key, defaultValue) => {
        if (!config || !Array.isArray(config)) return defaultValue;
        const item = config.find(item => item.key === key);
        return item ? item.value : defaultValue;
    };

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

    // Factor de velocidad: 0.4 significa que se mueve al 40% de la velocidad del scroll.
    // Si quieres MÁS movimiento, pon 0.5 o 0.6. Si quieres MENOS, pon 0.3.
    const parallaxSpeed = 0.4;

    return (
        <>
            {/* SEO */}
            <title>{getValue('hero_title', 'ITS-STONES')} | Inicio</title>
            <meta name="description" content={getValue('hero_text', 'Líderes en importación...')} />

            {/* Secction HERO */}
            <section id="home" className="hero-home">
                <div className="hero-image">
                    <img
                        src={getValue('hero_image', banner)}
                        alt="ITS-STONES Banner"
                        style={{
                            // Aquí está la magia sutil:
                            transform: `translateY(${offsetY * parallaxSpeed}px)`,
                            willChange: 'transform' // Optimización para el navegador
                        }}
                    />
                </div>
                <div className="hero-content">
                    <h1>{getValue('hero_title', 'ITS-STONES')}</h1>
                    <h2>{getValue('hero_subtitle', 'Precious Metals & Gems Import')}</h2>
                    <p>{getValue('hero_text', 'Discover the difference of trading with integrity and excellence.')}</p>
                    <ShineButton href="#contact">
                        {getValue('hero_cta_text', 'Contact us')}
                    </ShineButton>
                </div>
            </section>

            <section id="about-us" className="about-home"><About/></section>
            <section id="services" className="services-home"><Services /></section>
            <section id="mission" className="mission-home"><Mission /></section>
            <section id="branches" className="branches-section"><Branches /></section>
            <section id="contact" className="contact-home"><ContactForm /></section>
        </>
    );
}

export default Home;