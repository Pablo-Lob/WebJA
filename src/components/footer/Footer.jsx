import React from 'react';
import { Mail, Phone, MapPin } from 'lucide-react';
import './Footer.css';
import { Link } from 'react-router-dom';
import { useConfig } from '../../context/ConfigContext.jsx'; // Importamos hook

const Footer = () => {
    const { config } = useConfig();

    // Helper para obtener valor
    const getValue = (key, defaultValue) => {
        return config?.find(item => item.key === key)?.value || defaultValue;
    };

    return (
        <footer className="mineral-footer">
            {/* Main Footer Content */}
            <div className="footer-content">
                <div className="footer-grid">

                    {/* Productos (Estructural, se mantiene igual) */}
                    <div className="footer-column">
                        <h3 className="footer-heading">Products</h3>
                        <ul className="footer-links">
                            <li><a href="#" className="footer-link">Precious Metals</a></li>
                            <li><a href="#" className="footer-link">Gemstones</a></li>
                        </ul>
                    </div>

                    {/* Servicios (Estructural, se mantiene igual) */}
                    <div className="footer-column">
                        <h3 className="footer-heading">Service</h3>
                        <ul className="footer-links">
                            <li><a href="#" className="footer-link">Global Sourcing & Importation</a></li>
                            <li><a href="#" className="footer-link">Quality Assurance & Certification</a></li>
                            <li><a href="#" className="footer-link">Secure Logistics</a></li>
                            <li><a href="#" className="footer-link">Consultation & Market Insight</a></li>
                        </ul>
                    </div>

                    {/* Contact Us (DINÁMICO) */}
                    <div className="footer-column">
                        <h3 className="footer-heading">Contact Us</h3>
                        <div className="contact-info">
                            <div className="contact-item">
                                <MapPin className="contact-icon" />
                                <span className="contact-text">
                                    {getValue('contact_address', 'Dubai Airport Free Zone')}
                                </span>
                            </div>
                            <div className="contact-item">
                                <Phone className="contact-icon" />
                                <span className="contact-text">
                                    {getValue('contact_phone', '+971501775203')}
                                </span>
                            </div>
                            <div className="contact-item">
                                <Mail className="contact-icon" />
                                <span className="contact-text">
                                    {getValue('contact_email', 'info@itsstonesfzco.com')}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Footer */}
            <div className="footer-bottom">
                <div className="footer-bottom-content">

                    {/* Copyright (DINÁMICO) */}
                    <div className="footer-copyright">
                        {getValue('footer_copyright', '© 2025 ITS-Stones Integrated Stone Trading Services. All rights reserved.')}
                    </div>

                    {/* Additional Links */}
                    <div className="footer-legal-links">
                        <Link to="/terms-policy" className="legal-link">Terms</Link>
                        <Link to="/privacy-policy" className="legal-link">Privacy</Link>
                        <Link to="/cookie-policy" className="legal-link">Cookies</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;