import React from 'react';

function About() {
    return (
        <div className="contact-container">
            <h1 className="contact-title">Contact-Us</h1>
            <p className="contact-desc">¿Tienes preguntas o quieres colaborar? ¡Escríbenos!</p>
            <form className="contact-form">
                <input type="text" placeholder="Nombre" required/>
                <input type="email" placeholder="Correo electrónico" required/>
                <textarea rows="4" placeholder="Mensaje" required/>
                <button type="submit">Enviar</button>
            </form>
            <div className="contact-socials">
                <a href="" className="social neon-glow"
                   target="_blank" rel="noopener noreferrer"></a>
                <a href="" className="social neon-glow" target="_blank"
                   rel="noopener noreferrer"></a>
            </div>
        </div>
    );
}

export default About;