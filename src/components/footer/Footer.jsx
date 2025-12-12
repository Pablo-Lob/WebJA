import React from 'react';
import { Mail, Phone, MapPin, Facebook, Instagram, Twitter, Youtube, Gem } from 'lucide-react';
import './Footer.css';

const Footer = () => {
    return (
        <footer className="mineral-footer">
            {/* Main Footer Content */}
            <div className="footer-content">
                <div className="footer-grid">

                    {/* Productos */}
                    <div className="footer-column">
                        <h3 className="footer-heading">Productos</h3>
                        <ul className="footer-links">
                            <li><a href="#" className="footer-link">Cuarzos</a></li>
                            <li><a href="#" className="footer-link">Amatistas</a></li>
                            <li><a href="#" className="footer-link">Piedras Preciosas</a></li>
                            <li><a href="#" className="footer-link">Minerales Raros</a></li>
                            <li><a href="#" className="footer-link">Colecciones</a></li>
                            <li><a href="#" className="footer-link">Joyería Mineral</a></li>
                        </ul>
                    </div>

                    {/* Servicios */}
                    <div className="footer-column">
                        <h3 className="footer-heading">Servicios</h3>
                        <ul className="footer-links">
                            <li><a href="#" className="footer-link">Identificación</a></li>
                            <li><a href="#" className="footer-link">Tasación</a></li>
                            <li><a href="#" className="footer-link">Asesoramiento</a></li>
                            <li><a href="#" className="footer-link">Envíos Seguros</a></li>
                            <li><a href="#" className="footer-link">Certificación</a></li>
                        </ul>
                    </div>

                    {/* Ayuda */}
                    <div className="footer-column">
                        <h3 className="footer-heading">Ayuda</h3>
                        <ul className="footer-links">
                            <li><a href="#" className="footer-link">Contacto</a></li>
                            <li><a href="#" className="footer-link">Preguntas Frecuentes</a></li>
                            <li><a href="#" className="footer-link">Guía de Cuidados</a></li>
                            <li><a href="#" className="footer-link">Chat en Vivo</a></li>
                            <li><a href="#" className="footer-link">Garantías</a></li>
                        </ul>
                    </div>

                    {/* Legal */}
                    <div className="footer-column">
                        <h3 className="footer-heading">Legal</h3>
                        <ul className="footer-links">
                            <li><a href="#" className="footer-link">Política de Privacidad</a></li>
                            <li><a href="#" className="footer-link">Términos de Uso</a></li>
                            <li><a href="#" className="footer-link">Política de Devoluciones</a></li>
                            <li><a href="#" className="footer-link">Política de Cookies</a></li>
                            <li><a href="#" className="footer-link">Aviso Legal</a></li>
                        </ul>
                    </div>

                    {/* Contacto */}
                    <div className="footer-column">
                        <h3 className="footer-heading">Contacto</h3>
                        <div className="contact-info">
                            <div className="contact-item">
                                <MapPin className="contact-icon" />
                                <span className="contact-text">Adress: 5WA 328-Third Floor-5 West A  Dubai U.A.E, C:N 284157</span>
                                </div>
                                <div className="contact-item">
                                <Phone className="contact-icon" />
                                <span className="contact-text">+971 504 272 232      </span>
                            </div>
                            <div className="contact-item">
                                <Mail className="contact-icon" />
                                <span className="contact-text">info@its-stones.com</span>
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
                        <a href="/privacy-policy" className="legal-link">Términos</a>
                        <a href="/privacy-policy" className="legal-link">Privacidad</a>
                        <a href="/cookies-policy" className="legal-link">Cookies</a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;