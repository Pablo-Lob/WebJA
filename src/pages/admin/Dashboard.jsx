import React from 'react';
import { useNavigate } from 'react-router-dom';
import './styles/Dashboard.css';
// 1. AÑADIMOS 'Globe' y 'Gem' A LOS IMPORTS
import { Palette, Image, LogOut, Globe, Gem, Briefcase} from 'lucide-react';

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
            id: 'minerals',
            title: 'Gestor de Minerales',
            description: 'Actualiza el catálogo de minerales.',
            icon: <Gem size={40} />,
            isDirectLink: true,
            path: '/admin/catalog'
        },
        {
            id: 'branches',
            title: 'Gestor de Sedes',
            description: 'Añade o edita las sedes globales (Branches).',
            icon: <Globe size={40} />,
            isDirectLink: true,
            path: '/admin/branches'
        },
        {
            id: 'services',
            title: 'Gestor de Servicios',
            description: 'Edita los servicios ofrecidos (Importación/Logística).',
            icon: <Briefcase size={40} />,
            isDirectLink: true,
            path: '/admin/services'
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
                        // 3. CORREGIDO: LÓGICA PARA DECIDIR SI ES TAB O RUTA DIRECTA
                        onClick={() => {
                            if (section.isDirectLink) {
                                navigate(section.path);
                            } else {
                                goToTab(section.tabTarget);
                            }
                        }}
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