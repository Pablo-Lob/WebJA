import React from 'react';
import ContactForm from "../components/ContactForm.jsx";

function About() {
    return (
        <div className="about-us-container">
            <h1 className="about-us-title">About-Us</h1>
            <p>
                ITS-STONES es una empresa internacional con sede en Dubái dedicada a la <strong>venta y exportación de
                piedras preciosas de gran tamaño</strong>. Disponemos de minas propias en Brasil y Kenia, lo que nos
                permite ofrecer una amplia variedad de rubíes, esmeraldas, zafiros y otras gemas únicas en el mercado.
            </p>
            <p>
                Nuestro equipo está compuesto por profesionales experimentados en minería, comercio internacional y
                logística. Nos especializamos en operaciones complejas de exportación, asegurando que cada piedra llegue
                a cualquier parte del mundo con las máximas garantías.
            </p>
            <p>
                <strong>Nuestro valor diferencial:</strong>
            </p>
                <ul>
                    <li>Venta exclusiva de piedras preciosas de gran tamaño (de decenas a cientos de kilogramos)</li>
                    <li>Certificación y trazabilidad total de cada gema</li>
                    <li>Capacidad para servir a inversores, mayoristas y clientes que buscan utilizar las piedras como
                        aval financiero
                    </li>
                    <li>Atención personalizada en español, inglés y portugués</li>
                  </ul>
            <p>
                Si buscas una auténtica <strong>piedra gigante</strong> para inversión, aval o colección, somos tu
                aliado de confianza.
            </p>


            {/*Contact Form */}
            <section className="contact-form">
                <ContactForm>
                </ContactForm>
            </section>
        </div>
    );
}

export default About;