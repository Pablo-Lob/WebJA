import React from 'react';
import './styles/Home.css';
import ShineButton from '../components/shineButton/ShineButton.jsx';
import ContactForm from "../components/contactForm/ContactForm.jsx";
import banner from '../assets/banner.webp';
import Branches from "../components/branches/Branches.jsx";
import About from "../components/about/About.jsx";
import Services from "../components/services/Services.jsx";
import Mission from "../components/mission/Mission.jsx";
import {useConfig} from "../context/ConfigContext.jsx";

function Home () {
    const {config} = useConfig();
    return (
        <>
            {/* Hero Section */}
            <section id="home" className="hero-home">
                <div className="hero-image">
                    <img src={config.images?.banner || banner} alt="ITS-STONES Banner" />
                </div>
                <div className="hero-content">
                    <h1>ITS-STONES</h1>
                    <h2>Precious Metals & Gems Import</h2>
                    <p>
                        Discover the difference of trading with integrity and excellence.
                    </p>
                    <ShineButton href="#contact" >
                        Contact us
                    </ShineButton>
                </div>
            </section>

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
