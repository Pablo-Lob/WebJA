import React from 'react';
import '../styles/Home.css';
import ShineButton from '../components/shineButton/ShineButton.jsx';
import ContactForm from "../components/contactForm/ContactForm.jsx";
import Carrusel from "../components/carrusel/Carrusel.jsx";
import { UserCheck, ShieldCheck, Gem, Globe, DollarSign, FileCheck, Users } from 'lucide-react';

function Home () {
    return (
        <>
            {/* Hero Section */}
            <section className="hero-home">
                <div className="hero-content">
                    <h1>ITS-STONES</h1>
                    <h2>Minerales al por mayor desde Dubái</h2>
                    <p>
                        Suministramos rubí, esmeralda y otros minerales preciosos en grandes cantidades para distribuidores y empresas a nivel global.
                    </p>
                    <ShineButton>
                        Solicita tu cotización
                    </ShineButton>
                </div>
            </section>

            {/* ¿Para quien es esto? */}
            <section className="quien-es-esto">
                <div className="section-container">
                    <h3 className="section-title">¿Para quién es <span className="highlight-text">ITS-STONES</span>?</h3>
                    <div className="cards-grid">
                        <div className="info-card">
                            <div className="icon-wrapper"><Gem size={32} /></div>
                            <h4>Distribuidores e Inversores</h4>
                            <p>En busca de piezas únicas, exclusivas y de alto valor en el mercado internacional.</p>
                        </div>
                        <div className="info-card">
                            <div className="icon-wrapper"><ShieldCheck size={32} /></div>
                            <h4>Avales Financieros</h4>
                            <p>Empresas o particulares que necesiten respaldar préstamos y operaciones con activos sólidos.</p>
                        </div>
                        <div className="info-card">
                            <div className="icon-wrapper"><Users size={32} /></div>
                            <h4>Comerciales y Subastas</h4>
                            <p>Grandes casas de subastas y comerciales de minerales que requieren volumen y certificación.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Productos principales */}
            <section className="productos-destacados">
                <h3>Nuestros minerales</h3>
                <Carrusel>
                </Carrusel>
                <p>Todas nuestras gemas cuentan con certificación de origen y autenticidad. Ofrecemos envío seguro y
                    gestión aduanera internacional.
                </p>
            </section>

            {/* Beneficios B2B */}
            <section className="b2b-benefits">
                <div className="section-container">
                    <h3 className="section-title">¿Por qué elegirnos?</h3>
                    <div className="features-grid">
                        <div className="feature-item">
                            <Globe className="feature-icon" />
                            <div className="feature-text">
                                <h4>Envíos Internacionales</h4>
                                <p>Logística segura desde Dubái a cualquier parte del mundo.</p>
                            </div>
                        </div>
                        <div className="feature-item">
                            <DollarSign className="feature-icon" />
                            <div className="feature-text">
                                <h4>Precios Mayoristas</h4>
                                <p>Tarifas especiales para grandes volúmenes y contratos corporativos.</p>
                            </div>
                        </div>
                        <div className="feature-item">
                            <FileCheck className="feature-icon" />
                            <div className="feature-text">
                                <h4>Certificación Total</h4>
                                <p>Trazabilidad y autenticidad garantizada en todos los lotes.</p>
                            </div>
                        </div>
                        <div className="feature-item">
                            <UserCheck className="feature-icon" />
                            <div className="feature-text">
                                <h4>Asesoría Experta</h4>
                                <p>Atención personalizada para empresas y grandes mayoristas.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Contacto */}
            <section id="contacto" className="contacto-home">
                <h3>Solicita información o presupuesto</h3>
                <ContactForm />
            </section>
            {/* Footer */}
        </>
    );
}

export default Home;
