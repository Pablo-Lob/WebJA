import React, { useState } from 'react';
import { Link } from 'react-router-dom'; // Usamos Link para evitar recargas
import './Navbar.css';
import logo from '../../assets/logo.webp';

function Navbar() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <nav className="navbar">
            {/* Logo */}
            <div className="navbar-brand-container">
                <img className="navbar-brand" src={logo} alt="Logo" />
            </div>

            {/* Menú Hamburguesa (Móvil) */}
            <div className="hamburger" onClick={() => setIsOpen(!isOpen)}>
                <span className={isOpen ? "bar open" : "bar"}></span>
                <span className={isOpen ? "bar open" : "bar"}></span>
                <span className={isOpen ? "bar open" : "bar"}></span>
            </div>

            {/* Enlaces */}
            <ul className={isOpen ? "nav-links open" : "nav-links"}>
                <li><Link to="/" onClick={() => setIsOpen(false)}>Home</Link></li>
                <li><Link to="/about" onClick={() => setIsOpen(false)}>About</Link></li>
                <li><Link to="/minerals" onClick={() => setIsOpen(false)}>Minerals</Link></li>
            </ul>
        </nav>
    );
}

export default Navbar;