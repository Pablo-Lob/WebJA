import React, {useState, useEffect, useRef} from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Navbar.css';
import logo from '../../assets/logo.webp';
import { useConfig } from '../../context/ConfigContext.jsx';
import { HiMenu, HiX } from 'react-icons/hi';

function Navbar() {
    const [visible, setVisible] = useState(true);
    const [activeLink, setActiveLink] = useState('Home');
    const [menuOpen, setMenuOpen] = useState(false);
    const lastScrollY = useRef(typeof window !== 'undefined' ?  window.scrollY :  0);
    const { config } = useConfig();

    // Hooks necesarios para la navegación entre páginas
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        const handleScroll = () => {
            const currentY = window.scrollY;
            if (currentY > lastScrollY.current && currentY > 50) {
                setVisible(false);
            } else {
                setVisible(true);
            }
            lastScrollY.current = currentY;
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleNavClick = (e, sectionId, linkName) => {
        e.preventDefault();
        setMenuOpen(false);
        setActiveLink(linkName);

        // 1. Si estamos en la página de inicio ('/'), hacemos scroll normal
        if (location.pathname === '/') {
            const element = document.getElementById(sectionId);
            if (element) {
                element.scrollIntoView({ behavior: 'smooth' });
            }
        }
        // 2. Si NO estamos en inicio, navegamos a Home y pasamos el ID
        else {
            navigate('/', { state: { targetId: sectionId } });
        }
    };

    const handleHomeClick = (e) => {
        e.preventDefault();
        setMenuOpen(false);
        setActiveLink('Home');

        // Misma lógica para el botón Home
        if (location.pathname === '/') {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } else {
            navigate('/', { state: { targetId: 'home' } });
        }
    };

    return (
        <nav className={`navbar navbar-expand-lg fixed-top custom-navbar-wrapper ${visible ? 'nav-visible' : 'nav-hidden'}`}>
            <div className="container-fluid">

                <div className="nav-logo">
                    <a className="navbar-brand m-0" href="/" onClick={handleHomeClick}>
                        <img src={config?.images?.logo || logo} alt="Logo" />
                    </a>
                </div>

                <button
                    className="navbar-toggler d-lg-none"
                    type="button"
                    onClick={() => setMenuOpen(!menuOpen)}
                    aria-label="Toggle navigation"
                >
                    {menuOpen ? <HiX size={28} color="#ffffff" /> :  <HiMenu size={28} color="#ffffff" />}
                </button>

                <div className={`navbar-collapse ${menuOpen ? 'show' : ''}`}>
                    <ul className="navbar-nav">
                        <li className="nav-item">
                            <a
                                className={`nav-link ${activeLink === 'Home' ? 'active' : ''}`}
                                href="/"
                                onClick={handleHomeClick}
                            >
                                Home
                            </a>
                        </li>
                        <li className="nav-item">
                            <a
                                className={`nav-link ${activeLink === 'About-us' ? 'active' : ''}`}
                                href="#about-us"
                                onClick={(e) => handleNavClick(e, 'about-us', 'About-us')}
                            >
                                About Us
                            </a>
                        </li>
                        <li className="nav-item">
                            <a
                                className={`nav-link ${activeLink === 'Services' ? 'active' : ''}`}
                                href="#services"
                                onClick={(e) => handleNavClick(e, 'services', 'Services')}
                            >
                                Services
                            </a>
                        </li>
                        <li className="nav-item">
                            <a
                                className={`nav-link ${activeLink === 'Mission' ? 'active' : ''}`}
                                href="#mission"
                                onClick={(e) => handleNavClick(e, 'mission', 'Mission')}
                            >
                                Mission
                            </a>
                        </li>
                        <li className="nav-item">
                            <a
                                className={`nav-link ${activeLink === 'Branches' ?  'active' :  ''}`}
                                href="#branches"
                                onClick={(e) => handleNavClick(e, 'branches', 'Branches')}
                            >
                                Branches
                            </a>
                        </li>
                        <li className="nav-item">
                            <a
                                className={`nav-link ${activeLink === 'Contact-us' ? 'active' : ''}`}
                                href="#contact"
                                onClick={(e) => handleNavClick(e, 'contact', 'Contact-us')}
                            >
                                Contact Us
                            </a>
                        </li>
                    </ul>
                </div>

            </div>
        </nav>
    );
}

export default Navbar;