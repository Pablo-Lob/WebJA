import React, {useState} from 'react';
import './ContactForm.css';
import { collection, addDoc} from "firebase/firestore";
import {db} from "../../firebase/firebase-config.js";

function ContactForm () {

    // 1. Estado visual (lo que ve el usuario en los inputs)
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        message: '',
    });

    const [submitStatus, setSubmitStatus] = useState(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: value,
        }));
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitStatus('sending');

        try {
            // 2. PREPARACIÓN DE DATOS (Data Mapping)
            // Aquí combinamos los campos nuevos para que encajen con lo que tu backend espera.
            const dataToSend = {
                // Reconstruimos el campo 'name' uniendo nombre y apellido
                name: `${formData.firstName} ${formData.lastName}`,

                email: formData.email,

                // Como el diseño nuevo no tiene "Asunto", mandamos uno por defecto
                // para que no quede vacío en la base de datos.
                subject: "Nuevo contacto desde la web (Formulario)",

                message: formData.message,

                // Añadimos el teléfono como extra (si tu script de correo no lo usa,
                // simplemente se guardará en Firebase y ya está, no rompe nada).
                phone: formData.phone,

                timestamp: new Date().toISOString(),
            };

            const docRef = await addDoc(collection(db, "contactMessages"), dataToSend);

            console.log("Document escrito con ID: ", docRef.id);
            setSubmitStatus('success');

            // Limpiamos el formulario
            setFormData({
                firstName: '',
                lastName: '',
                email: '',
                phone: '',
                message: '',
            });
        } catch (error) {
            console.log("Error añadiendo documento: ", error);
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
                    <input
                        required
                        placeholder="Phone number*"
                        className="input-field"
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                    />
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
                        Send
                    </button>
                </div>

                <div className="feedback-message">
                    {submitStatus === 'sending' && <p>Enviando mensaje...</p>}
                    {submitStatus === 'success' && <p style={{ color: '#4caf50' }}>¡Mensaje enviado con éxito!</p>}
                    {submitStatus === 'error' && <p style={{ color: '#f44336' }}>Hubo un error al enviar tu mensaje. Inténtalo de nuevo.</p>}
                </div>
            </form>
        </div>
    );
}

export default ContactForm;