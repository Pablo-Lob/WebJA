import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';
import { Image, LogOut, Globe, Gem, Briefcase, Users } from 'lucide-react';

const Dashboard = () => {
    const navigate = useNavigate();
    const [role, setRole] = useState('editor'); // Por defecto 'editor' para seguridad

    useEffect(() => {
        // Leer el rol guardado al cargar
        const storedRole = localStorage.getItem('adminRole');
        if (storedRole) {
            setRole(storedRole);
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminUserId');
        localStorage.removeItem('adminRole');
        navigate('/admin/login');
    };

    const goToTab = (tabName) => {
        navigate('/admin/content', { state: { initialTab: tabName } });
    };

    // Definimos todas las secciones
    const allSections = [
        {
            id: 'landing',
            title: 'Gestor Landing Page',
            description: 'Hero, Servicios, Sedes...',
            icon: <Image size={40} />,
            isDirectLink: true,
            path: '/admin/dashboard/landing-page',
            requiredRole: 'editor' // Todos pueden ver esto
        },
        {
            id: 'minerals',
            title: 'Gestor de Minerales',
            description: 'Actualiza el catálogo de minerales.',
            icon: <Gem size={40} />,
            isDirectLink: true,
            path: '/admin/catalog',
            requiredRole: 'editor'
        },
        {
            id: 'blog',
            title: 'Gestor de Blog',
            description: 'Publicar noticias (Próximamente).',
            icon: <Briefcase size={40} />,
            isDirectLink: true,
            path: '/admin/blog',
            requiredRole: 'editor'
        },
        {
            id: 'users',
            title: 'Gestor de Usuarios',
            description: 'Añadir admins y permisos.',
            icon: <Users size={40} />,
            isDirectLink: true,
            path: '/admin/users',
            requiredRole: 'superadmin' // <--- SOLO SUPERADMIN
        }
    ];

    // Filtramos las secciones según el rol del usuario
    const visibleSections = allSections.filter(section => {
        if (section.requiredRole === 'superadmin' && role !== 'superadmin') {
            return false; // Ocultar si requiere superadmin y no lo eres
        }
        return true;
    });

    return (
        <div className="dashboard-container">
            <div className="dashboard-header">
                <h1>Panel de Control</h1>
                <p>Bienvenido al sistema de gestión ITS-Stones ({role === 'superadmin' ? 'Super Admin' : 'Editor'})</p>
                <button onClick={handleLogout} className="logout-button">
                    <LogOut size={18} style={{marginRight: '8px'}}/> Cerrar Sesión
                </button>
            </div>

            <div className="dashboard-grid">
                {visibleSections.map((section) => (
                    <div
                        key={section.id}
                        className="dashboard-card"
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