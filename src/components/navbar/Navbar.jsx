import React, {useState, useEffect, useRef} from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Navbar.css';
import logo from '../../assets/logo.webp';
import { useConfig } from '../../context/ConfigContext.jsx';

function Navbar() {
    const [visible, setVisible] = useState(true);
    const [activeLink, setActiveLink] = useState('Home');
    const lastScrollY = useRef(typeof window !== 'undefined' ? window.scrollY : 0);
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

    const onUpdateActiveLink = (value) => {
        setActiveLink(value);
    }

    return (
        <nav className={`navbar navbar-expand-lg fixed-top custom-navbar-wrapper ${visible ? 'nav-visible' : 'nav-hidden'}`}>
            <div className="container-fluid d-flex flex-column">

                {/* Logo */}
                <div className="nav-logo">
                    <a className="navbar-brand m-0" href="/">
                        <img src={config.images?. logo || logo} alt="Logo" />
                    </a>
                </div>

                {/* Menu items */}
                <div className="nav-menu w-100">
                    <button className="navbar-toggler mx-auto mt-2" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav"
                            aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>

                    <div className="collapse navbar-collapse justify-content-center" id="navbarNav">
                        <ul className="navbar-nav">
                            <li className="nav-item">
                                <a
                                    className={`nav-link ${activeLink === 'Home' ?  'active' :  ''}`}
                                    href="/"
                                    onClick={() => onUpdateActiveLink('Home')}
                                >
                                    Home
                                </a>
                            </li>
                            <li className="nav-item">
                                <a
                                    className={`nav-link ${activeLink === 'About-us' ? 'active' : ''}`}
                                    href="/#about-us"
                                    onClick={() => onUpdateActiveLink('About-us')}
                                >
                                    About Us
                                </a>
                            </li>
                            <li className="nav-item">
                                <a
                                    className={`nav-link ${activeLink === 'Mission' ? 'active' : ''}`}
                                    href="/#mission"
                                    onClick={() => onUpdateActiveLink('Mission')}
                                >
                                    Mission
                                </a>
                            </li>
                            <li className="nav-item">
                                <a
                                    className={`nav-link ${activeLink === 'Branches' ? 'active' : ''}`}
                                    href="/#branches"
                                    onClick={() => onUpdateActiveLink('Branches')}
                                >
                                    Branches
                                </a>
                            </li>
                            <li className="nav-item">
                                <a
                                    className={`nav-link ${activeLink === 'Services' ? 'active' : ''}`}
                                    href="/#services"
                                    onClick={() => onUpdateActiveLink('Services')}
                                >
                                    Services
                                </a>
                            </li>
                            <li className="nav-item">
                                <a
                                    className={`nav-link ${activeLink === 'Contact-us' ? 'active' : ''}`}
                                    href="/#contact"
                                    onClick={() => onUpdateActiveLink('Contact-us')}
                                >
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