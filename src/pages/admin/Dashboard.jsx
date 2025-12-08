// File: src/pages/admin/Dashboard.jsx
import React from 'react';
import {Link, useNavigate} from 'react-router-dom';
import './Dashboard.css';

const Dashboard = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('adminToken');
        navigate('/admin/login');
    };

    const sections = [
        {
            title: 'Colores y Tema',
            description: 'Personaliza los colores principales de la web',
            icon: '🎨',
            link: '/admin/colors'
        },
        {
            title: 'Banner Principal',
            description: 'Modifica la imagen y texto del banner',
            icon: '🖼️',
            link: '/admin/banner'
        },
        {
            title: 'Productos Destacados',
            description: 'Gestiona los productos del carrusel principal',
            icon: '⭐',
            link: '/admin/featured'
        },
        {
            title: 'Catálogo de Minerales',
            description: 'Agregar, editar o eliminar minerales',
            icon: '💎',
            link: '/admin/minerals'
        },
        {
            title: 'Sección B2B',
            description: 'Edita el contenido de la sección B2B',
            icon: '🤝',
            link: '/admin/b2b'
        },
        {
            title: '¿Para Quién?',
            description: 'Modifica las tarjetas informativas',
            icon: '👥',
            link: '/admin/target'
        }
    ];

    return (
        <div className="dashboard-container">
            <div className="dashboard-header">
                <h1>Panel de Administración</h1>
                <p>Gestiona todo el contenido de tu sitio web</p>
                <button onClick={handleLogout} className="logout-button">
                    Cerrar Sesión
                </button>
            </div>

            <div className="dashboard-grid">
                {sections.map((section, index) => (
                    <Link
                        to={section.link}
                        key={index}
                        className="dashboard-card"
                    >
                        <div className="card-icon">{section.icon}</div>
                        <h3>{section.title}</h3>
                        <p>{section.description}</p>
                        <span className="card-arrow">→</span>
                    </Link>
                ))}
            </div>

            <div className="dashboard-footer">
                <Link to="/" className="back-to-site">
                    ← Volver al sitio
                </Link>
            </div>
        </div>
    );
};

export default Dashboard;