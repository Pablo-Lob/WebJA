import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';
import { Image, LogOut, Globe, Gem, Briefcase, Users, FileText, Lock } from 'lucide-react';

const Dashboard = () => {
    const navigate = useNavigate();
    const [role, setRole] = useState('editor');

    useEffect(() => {
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

    const allSections = [
        {
            id: 'landing',
            title: 'Landing Page Manager',
            description: 'Hero, Services, Branches...',
            icon: <Image size={40} />,
            isDirectLink: true,
            path: '/admin/dashboard/landing-page',
            requiredRole: 'editor'
        },
        {
            id: 'minerals',
            title: 'Minerals Manager',
            description: 'Update the minerals catalog.',
            icon: <Gem size={40} />,
            isDirectLink: true,
            path: '/admin/dashboard/catalog',
            requiredRole: 'editor'
        },
        {
            id: 'blog',
            title: 'Blog / News',
            description: 'Manage articles and posts.',
            icon: <FileText size={40} />,
            isDirectLink: true,
            path: '/admin/dashboard/blog',
            requiredRole: 'editor'
        },
        {
            id: 'admins',
            title: 'Administrators',
            description: 'Manage users and roles.',
            icon: <Users size={40} />,
            isDirectLink: true,
            path: '/admin/dashboard/users',
            requiredRole: 'superadmin'
        },
        {
            id: 'password',
            title: 'Change Password',
            description: 'Update your access key.',
            icon: <Lock size={40} />,
            isDirectLink: true,
            path: '/admin/change-password',
            requiredRole: 'editor'
        }
    ];

    // Filter sections based on role
    const visibleSections = allSections.filter(section => {
        if (role === 'superadmin') return true;
        return section.requiredRole === 'editor';
    });

    return (
        <div className="dashboard-container">
            <div className="dashboard-header">
                <div className="header-text">
                    <h1>Dashboard</h1>
                    <p>Welcome to the ITS-Stones Management System ({role === 'superadmin' ? 'Super Admin' : 'Editor'})</p>
                </div>
                <button onClick={handleLogout} className="logout-button">
                    <LogOut size={18} style={{marginRight: '8px'}}/> Logout
                </button>
            </div>

            <div className="dashboard-grid">
                {visibleSections.map((section) => (
                    <div
                        key={section.id}
                        className="dashboard-card"
                        onClick={() => navigate(section.path)}
                    >
                        <div className="card-icon">{section.icon}</div>
                        <h3>{section.title}</h3>
                        <p>{section.description}</p>
                        <span className="card-arrow">Manage &rarr;</span>
                    </div>
                ))}
            </div>

            <div className="dashboard-footer">
                <a href="/" className="back-to-site">
                    Go to Website
                </a>
            </div>
        </div>
    );
};

export default Dashboard;