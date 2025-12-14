import React, { useState, useEffect } from 'react';
import './ContactForm.css';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';

function ContactForm() {

    // 1. Estado visual (lo que ve el usuario en los inputs)
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '', // Aquí guardaremos el número completo con prefijo internacional
        message: '',
    });

    // Estado para la configuración regional (Nuevo)
    const [countryCode, setCountryCode] = useState('es');
    const [submitStatus, setSubmitStatus] = useState(null);

    // 2. Detección de ubicación (Nuevo)
    // Consultamos una API externa para saber el país del usuario y poner la bandera correcta por defecto.
    useEffect(() => {
        fetch('https://ipapi.co/json/')
            .then(res => res.json())
            .then(data => {
                if (data && data.country_code) {
                    setCountryCode(data.country_code.toLowerCase());
                }
            })
            .catch(err => console.error("No se pudo detectar el país:", err));
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: value,
        }));
    };

    // Manejador especial para el input de teléfono (Nuevo)
    const handlePhoneChange = (value, country, e, formattedValue) => {
        setFormData(prevData => ({
            ...prevData,
            phone: formattedValue, // Guardamos el valor formateado (ej: +34 600...)
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitStatus('sending');

        // 3. PREPARACIÓN DE DATOS (Data Mapping)
        // Aquí combinamos los campos nuevos para que encajen con lo que tu backend (PHP) espera.
        const dataToSend = {
            // Reconstruimos el campo 'name' uniendo nombre y apellido
            name: `${formData.firstName} ${formData.lastName}`,

            email: formData.email,

            // Como el diseño nuevo no tiene "Asunto", mandamos uno por defecto
            subject: "Nuevo contacto desde la web (Formulario)",

            message: formData.message,

            // Añadimos el teléfono formateado con prefijo
            phone: formData.phone,
        };

        try {
            // 4. ENVÍO AL SERVIDOR (PHP)
            // Hacemos la petición POST a tu archivo en Hostinger
            const response = await fetch('https://itsstonesfzco.com/send-mail.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(dataToSend),
            });

            if (response.ok) {
                console.log("Mensaje enviado correctamente al servidor.");
                setSubmitStatus('success');

                // Limpiamos el formulario
                setFormData({
                    firstName: '',
                    lastName: '',
                    email: '',
                    phone: '',
                    message: '',
                });
            } else {
                console.error("El servidor respondió con un error.");
                setSubmitStatus('error');
            }

        } catch (error) {
            console.error("Error de conexión al enviar el formulario:", error);
            setSubmitStatus('error');
        }
    };

    return (
        <div className="contact-container">
            <form className="form-grid" autoComplete="off" onSubmit={handleSubmit}>
                <h2 className="form-heading">Contact Us</h2>

                <div className="form-row">
                    <input
                        required
                        placeholder="First name*"
                        className="input-field"
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                    />
                    <input
                        required
                        placeholder="Last name*"
                        className="input-field"
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                    />
                </div>

                <div className="form-row">
                    <input
                        required
                        placeholder="Email address*"
                        className="input-field"
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                    />

                    {/* Componente de Teléfono con estilos personalizados */}
                    <div className="phone-input-wrapper">
                        <PhoneInput
                            country={countryCode}
                            value={formData.phone}
                            onChange={handlePhoneChange}
                            inputClass="input-field phone-custom-input"
                            buttonClass="phone-custom-button"
                            dropdownClass="phone-custom-dropdown"
                            preferredCountries={['ae', 'es', 'us', 'gb']} // Emiratos, España, USA, UK primero
                        />
                    </div>
                </div>

                <div className="form-row full-width">
                    <textarea
                        required
                        placeholder="Message*"
                        rows={4}
                        className="input-field textarea-field"
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                    ></textarea>
                </div>

                <div className="button-container">
                    <button
                        className="sendMessage-btn"
                        type="submit"
                        disabled={submitStatus === 'sending'}
                    >
                        {submitStatus === 'sending' ? 'Sending...' : 'Send'}
                    </button>
                </div>

                <div className="feedback-message">
                    {submitStatus === 'sending' && <p>Sending message...</p>}
                    {submitStatus === 'success' && <p style={{ color: '#4caf50' }}>Message sent successfully!</p>}
                    {submitStatus === 'error' && <p style={{ color: '#f44336' }}>There was an error sending your message. Please try again.</p>}
                </div>
            </form>
        </div>
    );
}

export default ContactForm;