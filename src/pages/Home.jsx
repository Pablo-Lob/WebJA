import React from 'react';
import '../styles/Home.css';
import ShineButton from '../components/ShineButton.jsx';
import ContactForm from "../components/ContactForm.jsx";
import Carrusel from "../components/Carrusel.jsx";

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

            {/* Productos principales */}
            <section className="productos-destacados">
                <h3>Nuestros minerales</h3>
                <Carrusel>

                </Carrusel>
            </section>

            {/* Beneficios B2B */}
            <section className="b2b-benefits">
                <h3>¿Por qué comprar con ITS-STONES?</h3>
                <ul>
                    <li><strong>Envíos internacionales</strong> desde Dubái a cualquier parte del mundo.</li>
                    <li><strong>Precios especiales</strong> para compras al por mayor y contratos corporativos.</li>
                    <li><strong>Certificación y trazabilidad</strong> en todos nuestros lotes de minerales.</li>
                    <li><strong>Asesoría personalizada</strong> para empresas y mayoristas.</li>
                </ul>
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
