import React, { useState, useEffect } from 'react';
import './ContactForm.css';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import { Link } from 'react-router-dom'; // Importamos Link para la política

function ContactForm() {

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        message: '',
    });

    const [countryCode, setCountryCode] = useState('es');
    const [submitStatus, setSubmitStatus] = useState(null);

    // Estado para controlar si mostramos la casilla de cookies
    const [showCookieCheckbox, setShowCookieCheckbox] = useState(false);
    // Estado para saber si la casilla está marcada
    const [cookieChecked, setCookieChecked] = useState(false);

    // 1. Al cargar, detectamos País y Estado de Cookies
    useEffect(() => {
        // API País
        fetch('https://ipapi.co/json/')
            .then(res => res.json())
            .then(data => {
                if (data && data.country_code) {
                    setCountryCode(data.country_code.toLowerCase());
                }
            })
            .catch(err => console.error("Error país:", err));

        // Comprobación de Cookies
        const consent = localStorage.getItem('cookieConsent');
        if (consent !== 'true') {
            setShowCookieCheckbox(true); // Si no ha aceptado, mostramos el checkbox
        }
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevData => ({ ...prevData, [name]: value }));
    };

    const handlePhoneChange = (value, country, e, formattedValue) => {
        setFormData(prevData => ({ ...prevData, phone: formattedValue }));
    };

    // Manejo del click en el checkbox de cookies
    const handleCookieCheck = (e) => {
        setCookieChecked(e.target.checked);
        if (e.target.checked) {
            // Si la marca, guardamos la aceptación inmediatamente
            localStorage.setItem('cookieConsent', 'true');
            // Opcional: Podrías ocultar el banner global si estuviera abierto disparando un evento,
            // pero con guardarlo en localStorage basta para futuras cargas.
        } else {
            // Si la desmarca (caso raro), borramos el permiso
            localStorage.removeItem('cookieConsent');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // VALIDACIÓN: Si se muestra el checkbox, DEBE estar marcado
        if (showCookieCheckbox && !cookieChecked) {
            alert("Please accept the Cookie Policy to submit this form.");
            return;
        }

        setSubmitStatus('sending');

        const dataToSend = {
            name: `${formData.firstName} ${formData.lastName}`,
            email: formData.email,
            subject: "Nuevo contacto desde la web (Formulario)",
            message: formData.message,
            phone: formData.phone,
        };

        try {
            const response = await fetch('https://itsstonesfzco.com/send-email.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(dataToSend),
            });

            if (response.ok) {
                setSubmitStatus('success');
                setFormData({
                    firstName: '', lastName: '', email: '', phone: '', message: '',
                });
                // Si envió con éxito y marcó el check, ya no necesitamos mostrarlo la próxima vez
                if (cookieChecked) setShowCookieCheckbox(false);
            } else {
                setSubmitStatus('error');
            }
        } catch (error) {
            console.error("Error envío:", error);
            setSubmitStatus('error');
        }
    };

    return (
        <div className="contact-container">
            <form className="form-grid" autoComplete="off" onSubmit={handleSubmit}>
                <h2 className="form-heading">Contact Us</h2>

                <div className="form-row">
                    <input required placeholder="First name*" className="input-field" type="text" name="firstName" value={formData.firstName} onChange={handleChange} />
                    <input required placeholder="Last name*" className="input-field" type="text" name="lastName" value={formData.lastName} onChange={handleChange} />
                </div>

                <div className="form-row">
                    <input required placeholder="Email address*" className="input-field" type="email" name="email" value={formData.email} onChange={handleChange} />
                    <div className="phone-input-wrapper">
                        <PhoneInput
                            country={countryCode}
                            value={formData.phone}
                            onChange={handlePhoneChange}
                            inputClass="input-field phone-custom-input"
                            buttonClass="phone-custom-button"
                            dropdownClass="phone-custom-dropdown"
                            preferredCountries={['ae', 'es', 'us', 'gb']}
                        />
                    </div>
                </div>

                <div className="form-row full-width">
                    <textarea required placeholder="Message*" rows={4} className="input-field textarea-field" name="message" value={formData.message} onChange={handleChange}></textarea>
                </div>

                {showCookieCheckbox && (
                    <div className="form-row full-width checkbox-row" style={{ marginTop: '10px', display: 'flex', alignItems: 'center', gap: '10px', color: '#fff' }}>
                        <input
                            type="checkbox"
                            id="cookieCheck"
                            checked={cookieChecked}
                            onChange={handleCookieCheck}
                            style={{ width: '20px', height: '20px', accentColor: 'var(--gold-primary)' }}
                        />
                        <label htmlFor="cookieCheck" style={{ fontSize: '0.9rem', cursor: 'pointer' }}>
                            I have read and accept the <Link to="/cookie-policy" style={{ color: 'var(--gold-primary)', textDecoration: 'underline' }}>Cookie Policy</Link>.
                        </label>
                    </div>
                )}

                <div className="button-container">
                    <button className="sendMessage-btn" type="submit" disabled={submitStatus === 'sending'}>
                        {submitStatus === 'sending' ? 'Sending...' : 'Send'}
                    </button>
                </div>

                <div className="feedback-message">
                    {submitStatus === 'sending' && <p>Sending message...</p>}
                    {submitStatus === 'success' && <p style={{ color: '#4caf50' }}>Message sent successfully!</p>}
                    {submitStatus === 'error' && <p style={{ color: '#f44336' }}>Error sending message.</p>}
                </div>
            </form>
        </div>
    );
}

export default ContactForm;