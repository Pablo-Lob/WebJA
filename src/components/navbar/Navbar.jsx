import React, {useState, useEffect, useRef} from 'react';
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
        const element = document.getElementById(sectionId);
        if (element) {
            element.scrollIntoView({ behavior:  'smooth' });
        }
        setActiveLink(linkName);
        setMenuOpen(false);
    };

    const handleHomeClick = (e) => {
        e.preventDefault();
        window.scrollTo({ top:  0, behavior:  'smooth' });
        setActiveLink('Home');
        setMenuOpen(false);
    };

    return (
        <nav className={`navbar navbar-expand-lg fixed-top custom-navbar-wrapper ${visible ? 'nav-visible' : 'nav-hidden'}`}>
            <div className="container-fluid">

                <div className="nav-logo">
                    <a className="navbar-brand m-0" href="/" onClick={handleHomeClick}>
                        <img src={config?.images?. logo || logo} alt="Logo" />
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
                                className={`nav-link ${activeLink === 'Services' ? 'active' : ''}`}
                                href="#services"
                                onClick={(e) => handleNavClick(e, 'services', 'Services')}
                            >
                                Services
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