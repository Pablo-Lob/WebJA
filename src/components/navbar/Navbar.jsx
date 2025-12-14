import React, { useState, useEffect } from 'react';
import './Navbar.css';
import logo from '../../assets/logo.webp';
import ShineButton from '../shineButton/ShineButton.jsx';
import { useLocation, useNavigate } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { useConfig } from "../../context/ConfigContext.jsx";

const Navbar = () => {
    const [scrolled, setScrolled] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();
    const { config } = useConfig();

    // Enlaces del menú (Asegúrate de que los href coinciden con los IDs en Home.jsx)
    const navLinks = [
        { title: 'Home', href: 'home' },         // Debe coincidir con id="home"
        { title: 'About Us', href: 'about-us' },
        { title: 'Services', href: 'services' },
        { title: 'Mission', href: 'mission' },
        { title: 'Contact', href: 'contact' } // Redirige al final
    ];

    // Detectar scroll para cambiar estilo del navbar
    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // FUNCIÓN CLAVE CORREGIDA
    const handleNavClick = (e, targetId) => {
        e.preventDefault();
        setIsMenuOpen(false); // Cerrar menú móvil si está abierto

        // 1. Si NO estamos en la página de inicio (ej: estamos en Catalog o Legal)
        if (location.pathname !== '/') {
            navigate('/'); // Navegar a Home

            // Esperar un poco a que cargue la Home y luego hacer scroll
            setTimeout(() => {
                // Si es "home", vamos arriba del todo
                if (targetId === 'home') {
                    window.scrollTo(0, 0);
                } else {
                    // Si es una sección, la buscamos
                    const element = document.getElementById(targetId);
                    if (element) {
                        element.scrollIntoView({ behavior: 'smooth' });
                    }
                }
            }, 100); // 100ms de retraso para asegurar que la página cambió
        }
        // 2. Si YA estamos en la Home
        else {
            if (targetId === 'home') {
                window.scrollTo({ top: 0, behavior: 'smooth' });
            } else {
                const element = document.getElementById(targetId);
                if (element) {
                    element.scrollIntoView({ behavior: 'smooth' });
                }
            }
        }
    };

    return (
        <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
            <div className="navbar-container">
                {/* Logo que también lleva al inicio */}
                <div className="navbar-logo" onClick={(e) => handleNavClick(e, 'home')}>
                    <img src={config.images?.logo || logo} alt="ITS Stones Logo" />
                </div>

                {/* Icono Menú Móvil */}
                <div className="menu-icon" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                    {isMenuOpen ? <X color="white" /> : <Menu color="white" />}
                </div>

                {/* Links de Navegación */}
                <ul className={`nav-menu ${isMenuOpen ? 'active' : ''}`}>
                    {navLinks.map((link, index) => (
                        <li key={index} className="nav-item">
                            <a
                                href={`#${link.href}`}
                                className="nav-links"
                                onClick={(e) => handleNavClick(e, link.href)}
                            >
                                {link.title}
                            </a>
                        </li>
                    ))}

                    {/* Botón especial Contact Us en el menú */}
                    <li className="nav-item-btn">
                        <ShineButton onClick={(e) => handleNavClick(e, 'contact')}>
                            Contact Us
                        </ShineButton>
                    </li>
                </ul>
            </div>
        </nav>
    );
};

export default Navbar;