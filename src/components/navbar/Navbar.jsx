import React, {useState, useEffect, useRef} from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Navbar.css';
import logo from '../../assets/logo.webp';
import { useConfig } from '../../context/ConfigContext.jsx';
import { Link, useLocation } from 'react-router-dom';

function Navbar() {
    const [visible, setVisible] = useState(true);
    const [activeLink, setActiveLink] = useState('Home');
    const lastScrollY = useRef(typeof window !== 'undefined' ? window.scrollY : 0);
    const { config } = useConfig();
    const location = useLocation();

    // Efecto para detectar en qué sección estamos y actualizar el menú activo automáticamente
    useEffect(() => {
        if (location.hash) {
            const sectionId = location.hash.replace('#', '');
            if (sectionId === 'about-us') setActiveLink('About-us');
            else if (sectionId === 'mission') setActiveLink('Mission');
            else if (sectionId === 'branches') setActiveLink('Branches');
            else if (sectionId === 'services') setActiveLink('Services');
            else if (sectionId === 'contact') setActiveLink('Contact-us');
        } else if (location.pathname === '/') {
            setActiveLink('Home');
        }
    }, [location]);

    useEffect(() => {
        const handleScroll = () => {
            const currentY = window.scrollY;
            if (currentY > lastScrollY.current && currentY > 50) {
                // Scroll down -> ocultar
                setVisible(false);
            } else {
                // Scroll up -> mostrar
                setVisible(true);
            }
            lastScrollY.current = currentY;
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Función para actualizar el estado del link activo
    const onUpdateActiveLink = (value) => {
        setActiveLink(value);
    }

    return (
        <nav className={`navbar navbar-expand-lg fixed-top custom-navbar-wrapper ${visible ? 'nav-visible' : 'nav-hidden'}`}>
            <div className="container-fluid d-flex flex-column">

                {/* Logo */}
                <div className="nav-logo">
                    {/* Corregido: Usamos Link to="/" en lugar de href a un archivo */}
                    <Link className="navbar-brand m-0" to="/" onClick={() => onUpdateActiveLink('Home')}>
                        <img src={config.images?.logo || logo} alt="Logo" />
                    </Link>
                </div>

                {/* Menú items */}
                <div className="nav-menu w-100">
                    <button className="navbar-toggler mx-auto mt-2" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav"
                            aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>

                    <div className="collapse navbar-collapse justify-content-center" id="navbarNav">
                        <ul className="navbar-nav">
                            <li className="nav-item">
                                <Link
                                    className={`nav-link ${activeLink === 'Home' ? 'active' : ''}`}
                                    to="/"
                                    onClick={() => onUpdateActiveLink('Home')}
                                >
                                    Home
                                </Link>
                            </li>
                            <li className="nav-item">
                                <Link
                                    className={`nav-link ${activeLink === 'About-us' ? 'active' : ''}`}
                                    to="/#about-us"
                                    onClick={() => onUpdateActiveLink('About-us')}
                                >
                                    About Us
                                </Link>
                            </li>
                            <li className="nav-item">
                                <Link
                                    className={`nav-link ${activeLink === 'Mission' ? 'active' : ''}`}
                                    to="/#mission"
                                    onClick={() => onUpdateActiveLink('Mission')}
                                >
                                    Mission
                                </Link>
                            </li>
                            <li className="nav-item">
                                <Link
                                    className={`nav-link ${activeLink === 'Branches' ? 'active' : ''}`}
                                    to="/#branches"
                                    onClick={() => onUpdateActiveLink('Branches')}
                                >
                                    Branches
                                </Link>
                            </li>
                            <li className="nav-item">
                                <Link
                                    className={`nav-link ${activeLink === 'Services' ? 'active' : ''}`}
                                    to="/#services"
                                    onClick={() => onUpdateActiveLink('Services')}
                                >
                                    Services
                                </Link>
                            </li>
                            <li className="nav-item">
                                <Link
                                    className={`nav-link ${activeLink === 'Contact-us' ? 'active' : ''}`}
                                    to="/#contact"
                                    onClick={() => onUpdateActiveLink('Contact-us')}
                                >
                                    Contact Us
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>

            </div>
        </nav>
    );
}
export default Navbar;