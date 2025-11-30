import React, {useState, useEffect, useRef} from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Navbar.css';
import logo from '../../assets/logo.webp';

function Navbar() {
    const [visible, setVisible] = useState(true);
    const lastScrollY = useRef(typeof window !== 'undefined' ? window.scrollY : 0);

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

    return (
        <nav className={`navbar navbar-expand-lg fixed-top custom-navbar-wrapper ${visible ? 'nav-visible' : 'nav-hidden'}`}>
            {/* Menú items */}
            <div className="nav-menu">
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav"
                aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse justify-content-center" id="navbarNav">
                <ul className="navbar-nav">
                    <li className="nav-item">
                    <a className="nav-link" href="/public">Home</a>
                    </li>
                    <li className="nav-item">
                    <a className="nav-link" href="/about">Sobre Nosotros</a>
                    </li>
                    <li className="nav-item">
                    <a className="nav-link" href="/minerals">Minerales</a>
                    </li>
                </ul>
                </div>
            </div>

            {/* Logo */}
            <div className="nav-logo">
                <a className="navbar-brand" href="../../pages/Home.jsx">
                    <img src={logo} alt="Logo"></img>
                </a>
            </div>
        </nav>
    );
}
export default Navbar;