import React from 'react';
import { Mail, Phone, MapPin, ArrowRight } from 'lucide-react';
import './Footer.css';
import { Link } from 'react-router-dom';
import { useConfig } from '../../context/ConfigContext.jsx';

const Footer = () => {
    const { config } = useConfig();

    // Helper para obtener valor
    const getValue = (key, defaultValue) => {
        return config?.find(item => item.key === key)?.value || defaultValue;
    };

    const address = getValue('contact_address', 'Dubai Aireport Free Zone');
    const phone = getValue('contact_phone', '+971501775203');
    const email = getValue('contact_email', 'info@itsstonesfzco.com');

    return (
        <footer className="mineral-footer">
            {/* Main Footer Content */}
            <div className="footer-content">
                <div className="footer-grid">

                    {/* Menu */}
                    <div className="footer-column">
                        <h3 className="footer-heading">Menu</h3>
                        <ul className="footer-links">
                            <li><a href="/" className="footer-link">Home</a></li>
                            <li><a href="/about-us" className="footer-link">About Us</a></li>
                            <li><a href="/products" className="footer-link">Products</a></li>
                            <li><a href="/services" className="footer-link">Services</a></li>
                            <li><a href="/contact-us" className="footer-link">Contact Us</a></li>
                            <li><a href="" className="footer-link">News & Blog</a></li>
                        </ul>
                    </div>

                    {/* Legal */}
                    <div className="footer-column">
                        <h3 className="footer-heading">Legal</h3>
                        <ul className="footer-links">
                            <li><a href="/privacy-policy" className="footer-link">Privacy Policy</a></li>
                            <li><a href="/cookie-policy" className="footer-link">Cookie Policy</a></li>
                            <li><a href="#" className="footer-link">Anti-Money Laundering (AML) / Know Your Customer (KYC) Policy</a></li>
                        </ul>
                    </div>

                    {/* Contact Us */}
                    <div className="footer-column">
                        <h3 className="footer-heading">Contact Us</h3>
                        <div className="contact-info">

                            {/* Dirección */}
                            <div className="contact-item">
                                <MapPin className="contact-icon" size={18} />
                                <a
                                    href={`https://maps.google.com/?q=${encodeURIComponent(address)}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="footer-link"
                                >
                                    {address}
                                </a>
                            </div>

                            {/* Teléfono */}
                            <div className="contact-item">
                                <Phone className="contact-icon" size={18} />
                                <a
                                    href={`tel:${phone.replace(/\s+/g, '')}`}
                                    className="footer-link"
                                >
                                    {phone}
                                </a>
                            </div>

                            {/* Email */}
                            <div className="contact-item">
                                <Mail className="contact-icon" size={18} />
                                <a
                                    href={`mailto:${email}`}
                                    className="footer-link"
                                >
                                    {email}
                                </a>
                            </div>

                            <div className="contact-item">
                                <Link to ="/contact" className="gold-button-outline">
                                    Contact Our Team <ArrowRight size={16} />
                                </Link>
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