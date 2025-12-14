import React from 'react';
import { Mail, Phone, MapPin} from 'lucide-react';
import './Footer.css';
import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer className="mineral-footer">
            {/* Main Footer Content */}
            <div className="footer-content">
                <div className="footer-grid">

                    {/* Productos */}
                    <div className="footer-column">
                        <h3 className="footer-heading">Products</h3>
                        <ul className="footer-links">
                            <li><a href="#" className="footer-link">Precious Metals</a></li>
                            <li><a href="#" className="footer-link">Gemstones</a></li>
                        </ul>
                    </div>

                    {/* Servicios */}
                    <div className="footer-column">
                        <h3 className="footer-heading">Service</h3>
                        <ul className="footer-links">
                            <li><a href="#" className="footer-link">Global Sourcing & Importation</a></li>
                            <li><a href="#" className="footer-link">Quality Assurance & Certification</a></li>
                            <li><a href="#" className="footer-link">Secure Logistics</a></li>
                            <li><a href="#" className="footer-link">Consultation & Market Insight</a></li>
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

                    {/* Contacto */}
                    <div className="footer-column">
                        <h3 className="footer-heading">Contact</h3>
                        <div className="contact-info">
                            <div className="contact-item">
                                <MapPin className="contact-icon" />
                                <a href="https://maps.app.goo.gl/J1PLLWMrtUt3n2Fe7" className="contact-text contact-link" target="_blank" rel="noopener noreferrer noreferrer">Address: Dubai Airport Free Zone</a>
                                </div>
                                <div className="contact-item">
                                <Phone className="contact-icon" />
                                <span className="contact-text">+971501775203</span>
                            </div>
                            <div className="contact-item">
                                <Mail className="contact-icon" />
                                <span className="contact-text">info@itsstonesfzco.com</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Footer */}
            <div className="footer-bottom">
                <div className="footer-bottom-content">

                    {/* Copyright */}
                    <div className="footer-copyright">
                        © 2025 ITS-Stones Integrated Stone Trading Services. All rights reserved.
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