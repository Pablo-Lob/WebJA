import React, {useState} from 'react';
import './ContactForm.css';
import { collection, addDoc} from "firebase/firestore";
import {db} from "../../firebase/firebase-config.js";

function ContactForm () {

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: '', // Si expandimos el form hay que agregar más campos a continuación
    });

    // Estado del envío
    const [submitStatus, setSubmitStatus] = useState(null);

    // Manejar cambios en los campos del formulario
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: value,
        }));
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitStatus('sending'); // Estado de envío en progreso

        try {
            const docRef = await addDoc(collection(db, "contactMessages"), {
                ...formData,
                timestamp: new Date().toISOString(),
            });
            console.log("Document escrito con ID: ", docRef.id);
            setSubmitStatus('success');
            // Limpiamos el formulario
            setFormData({
                name: '',
                email: '',
                subject: '',
                message: '',
            });
        } catch (error) {
            console.log("Error añadiendo documento: ", error);
            setSubmitStatus('error');
        }
    };
    return (
        <div className="form-card1">
            <div className="form-card2">
                <form className="form" autoComplete="off" onSubmit={handleSubmit}>
                    <p className="form-heading">Get In Touch</p>

                    <div className="form-field">
                        <input
                            required
                            placeholder="Name"
                            className="input-field"
                            type="text"
                            name="name"
                            value={formData.name} // Vincula el valor al estado
                            onChange={handleChange} // Vincula el cambio al handler
                        />
                    </div>

                    <div className="form-field">
                        <input
                            required
                            placeholder="Email"
                            className="input-field"
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="form-field">
                        <input
                            required
                            placeholder="Subject"
                            className="input-field"
                            type="text"
                            name="subject"
                            value={formData.subject}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="form-field">
                        <textarea
                            required
                            placeholder="Message"
                            cols={30}
                            rows={3}
                            className="input-field"
                            name="message"
                            value={formData.message}
                            onChange={handleChange}
                        ></textarea>
                    </div>


                    <button
                        className="sendMessage-btn"
                        type="submit"
                        disabled={submitStatus === 'sending'} // Deshabilita el botón mientras se envía
                    >
                        Send Message
                    </button>

                    {/*Feedback visual*/}
                    {submitStatus === 'sending' && <p>Enviando mensaje...</p>}
                    {submitStatus === 'success' && <p style={{ color: 'green' }}>¡Mensaje enviado con éxito!</p>}
                    {submitStatus === 'error' && <p style={{ color: 'red' }}>Hubo un error al enviar tu mensaje. Inténtalo de nuevo.</p>}
                </form>
            </div>
        </div>

    );
}

export default ContactForm;