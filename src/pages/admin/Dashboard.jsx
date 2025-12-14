import React from 'react';
import { useNavigate } from 'react-router-dom';
import './styles/Dashboard.css';
import { Palette, Image, FileText, LogOut, LayoutDashboard } from 'lucide-react';

const Dashboard = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('adminToken');
        navigate('/admin/login');
    };

    // Función para navegar a la pestaña específica
    const goToTab = (tabName) => {
        navigate('/admin/content', { state: { initialTab: tabName } });
    };

    const sections = [
        {
            id: 'colors',
            title: 'Identidad & Colores',
            description: 'Gestiona la paleta de colores global de la marca.',
            icon: <Palette size={40} />,
            tabTarget: 'colors'
        },
        {
            id: 'images',
            title: 'Gestor de Imágenes',
            description: 'Actualiza logos, banners y fotos de secciones principales.',
            icon: <Image size={40} />,
            tabTarget: 'images'
        },
        {
            id: 'minerals',
            title: 'Gestor de Minerales',
            description: 'Actualiza el catalogo de minerales.',
            icon: <Image size={40} />,
            tabTarget: 'images'
        },
        {
            id: 'branches',
            title: 'Gestor de Sedes',
            description: 'Añade o edita las sedes globales (Branches).',
            icon: <Globe size={40} />,
            isDirectLink: true,
            path: '/admin/branches'
        },
    ];

    return (
        <div className="dashboard-container">
            <div className="dashboard-header">
                <h1>Panel de Control</h1>
                <p>Bienvenido al sistema de gestión de ITS-Stones</p>
                <button onClick={handleLogout} className="logout-button">
                    <LogOut size={18} style={{marginRight: '8px'}}/> Cerrar Sesión
                </button>
            </div>

            <div className="dashboard-grid">
                {sections.map((section) => (
                    <div
                        key={section.id}
                        className="dashboard-card"
                        onClick={() => goToTab(section.tabTarget)}
                    >
                        <div className="card-icon">{section.icon}</div>
                        <h3>{section.title}</h3>
                        <p>{section.description}</p>
                        <span className="card-arrow">Gestionar →</span>
                    </div>
                ))}
            </div>

            <div className="dashboard-footer">
                <a href="/" className="back-to-site">
                    Ir al Sitio Web
                </a>
            </div>
        </div>
    );
};

export default Dashboard;