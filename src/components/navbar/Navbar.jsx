import React, {useState, useEffect, useRef} from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Navbar.css';
import logo from '../../assets/logo.webp';
import { useConfig } from '../../context/ConfigContext.jsx';

function Navbar() {
    const [visible, setVisible] = useState(true);
    const [activeLink, setActiveLink] = useState('Home');
    const [menuOpen, setMenuOpen] = useState(false);
    const lastScrollY = useRef(typeof window !== 'undefined' ?  window.scrollY :  0);
    const { config } = useConfig();

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

    const closeMenu = () => {
        setMenuOpen(false);
    };

    const handleAnchorClick = (e, sectionId, linkName) => {
        e.preventDefault();
        e.stopPropagation();

        const element = document.getElementById(sectionId);
        if (element) {
            const navbarHeight = 120;
            const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
            window.scrollTo({
                top: elementPosition - navbarHeight,
                behavior: 'smooth'
            });
        }

        window.history.replaceState(null, '', '#' + sectionId);
        setActiveLink(linkName);
        closeMenu();
    };

    const handleHomeClick = (e) => {
        e.preventDefault();
        e.stopPropagation();

        window.scrollTo({ top: 0, behavior: 'smooth' });
        window.history.replaceState(null, '', '/');
        setActiveLink('Home');
        closeMenu();
    };

    const toggleMenu = () => {
        setMenuOpen(!menuOpen);
    };

    return (
        <nav className={`navbar navbar-expand-lg fixed-top custom-navbar-wrapper ${visible ? 'nav-visible' : 'nav-hidden'}`}>
            <div className="container-fluid d-flex flex-column">
                <div className="nav-logo">
                    <a className="navbar-brand m-0" href="/" onClick={handleHomeClick}>
                        <img src={config.images?. logo || logo} alt="Logo" />
                    </a>
                </div>

                <div className="nav-menu w-100">
                    <button
                        className="navbar-toggler mx-auto mt-2"
                        type="button"
                        onClick={toggleMenu}
                        aria-controls="navbarNav"
                        aria-expanded={menuOpen}
                        aria-label="Toggle navigation"
                    >
                        <span className="navbar-toggler-icon"></span>
                    </button>

                    <div className={`collapse navbar-collapse justify-content-center ${menuOpen ? 'show' : ''}`} id="navbarNav">
                        <ul className="navbar-nav">
                            <li className="nav-item">
                                <a className={`nav-link ${activeLink === 'Home' ? 'active' : ''}`} href="/" onClick={handleHomeClick}>
                                    Home
                                </a>
                            </li>
                            <li className="nav-item">
                                <a className={`nav-link ${activeLink === 'About-us' ? 'active' : ''}`} href="#about-us" onClick={(e) => handleAnchorClick(e, 'about-us', 'About-us')}>
                                    About Us
                                </a>
                            </li>
                            <li className="nav-item">
                                <a className={`nav-link ${activeLink === 'Mission' ? 'active' : ''}`} href="#mission" onClick={(e) => handleAnchorClick(e, 'mission', 'Mission')}>
                                    Mission
                                </a>
                            </li>
                            <li className="nav-item">
                                <a className={`nav-link ${activeLink === 'Branches' ? 'active' : ''}`} href="#branches" onClick={(e) => handleAnchorClick(e, 'branches', 'Branches')}>
                                    Branches
                                </a>
                            </li>
                            <li className="nav-item">
                                <a className={`nav-link ${activeLink === 'Services' ? 'active' : ''}`} href="#services" onClick={(e) => handleAnchorClick(e, 'services', 'Services')}>
                                    Services
                                </a>
                            </li>
                            <li className="nav-item">
                                <a className={`nav-link ${activeLink === 'Contact-us' ? 'active' : ''}`} href="#contact" onClick={(e) => handleAnchorClick(e, 'contact', 'Contact-us')}>
                                    Contact Us
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </nav>
    );
}

export default Navbar;