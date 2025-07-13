import React from 'react';
import '../styles/Home.css';
import ShineButton from '../components/ShineButton.jsx';

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
                <h3>Nuestros minerales principales</h3>
                <div className="productos-grid">
                    <div className="producto">
                        <img src="/assets/ruby.webp" alt="Ruby" />
                        <h4>Rubí</h4>
                        <p>Lotes de hasta 100kg de rubí de la más alta calidad, listos para exportar.</p>
                    </div>
                    <div className="producto">
                        <img src="/assets/esmeralda.webp" alt="Esmeralda" />
                        <h4>Esmeralda</h4>
                        <p>Esmeraldas naturales seleccionadas para el mercado mayorista internacional.</p>
                    </div>
                    <div className="producto">
                        <img src="/assets/amatista.webp" alt="Amatista" />
                        <h4>Amatista</h4>
                        <p>Amatistas y otros minerales disponibles bajo pedido directo desde Dubái.</p>
                    </div>
                </div>
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
                <form>
                    <input type="text" name="empresa" placeholder="Nombre de la empresa" required />
                    <input type="email" name="email" placeholder="Correo de contacto" required />
                    <textarea name="mensaje" placeholder="¿Qué minerales necesitas y en qué cantidad?" required></textarea>
                    {/* Aquí irá la integración de reCAPTCHA */}
                    <button type="submit">Enviar consulta</button>
                </form>
                <p className="info-legal">
                    Estamos en Dubái y exportamos minerales legalmente a todo el mundo.
                </p>
            </section>
        </>
    );
}

export default Home;
