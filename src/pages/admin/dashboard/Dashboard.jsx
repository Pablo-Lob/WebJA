import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';
import { Palette, Image, LogOut, Globe, Gem, Briefcase, Users} from 'lucide-react';
import {CgPassword} from "react-icons/cg";
import {PiPassword} from "react-icons/pi";

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

    {/* const handleChangePassword = () => {
        const userId = localStorage.getItem('adminUserId');
        if (userId) {
            navigate('/admin/change-password');
        } else {
            alert('User ID not found. Please log in again.');
            navigate('/admin/login');
        }
    }*/}

    const sections = [
        {
            id: 'content',
            title: 'Landing Page Manager',
            description: 'Hero, Services, Branches...',
            icon: <Image size={40} />,
            isDirectLink: true,
            path: '/admin/dashboard/landing-page'
        },
        {
            id: 'minerals',
            title: 'Minerals Manager',
            description: 'Update the minerals catalog.',
            icon: <Gem size={40} />,
            isDirectLink: true,
            path: '/admin/catalog'
        },
        {
            id: 'blog',
            title: 'Blog Manager',
            description: 'Create and edit blog posts.',
            icon: <Briefcase size={40} />,
            isDirectLink: true,
            path: '/admin/blog'
        },
        {
            id: 'users',
            title: 'User Manager',
            description: 'Add admins and manage roles.',
            icon: <Users size={40} />,
            isDirectLink: true,
            path: '/admin/users'
        }
    ];

    return (
        <div className="dashboard-container">
            <div className="dashboard-header">
                <h1>Control Panel</h1>
                <p>Welcome to the ITS-Stones management system</p>
                <button onClick={handleLogout} className="logout-button">
                    <LogOut size={18} style={{marginRight: '8px'}}/> Logout
                </button>
                {/* <button onClick={handleChangePassword} className="changepassword-button">
                    <PiPassword size={18} style={{marginRight: '8px'}}/> Change Password
                </button> */}
            </div>

            <div className="dashboard-grid">
                {sections.map((section) => (
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
                        <span className="card-arrow">Manage →</span>
                    </div>
                ))}
            </div>

            <div className="dashboard-footer">
                <a href="/public" className="back-to-site">
                    Go to Website
                </a>
            </div>
        </div>
    );
};

export default Dashboard;