import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../dashboard/Dashboard.css'; // Reutilizamos el mismo CSS del Dashboard
import { Layout, Globe, Briefcase, FileText, ArrowLeft, Image } from 'lucide-react';

const ManageLanding = () => {
    const navigate = useNavigate();

    const landingSections = [
        {
            id: 'general-content',
            title: 'Hero',
            description: 'Hero, header',
            icon: <FileText size={40} />,
            path: '/admin/hero'
        },
        {
            id: 'about-us',
            title: 'About Us',
            description: 'About Us section',
            icon: <Layout size={40}/>,
            path: '/admin/about-us'
        },
        {
            id: 'services',
            title: 'Services',
            description: 'Add or edit service.',
            icon: <Briefcase size={40} />,
            path: '/admin/services'
        },
        {
            id: 'missions',
            title: 'Missions',
            description: 'Add or edit mission section.',
            icon: <Image size={40} />,
            path: '/admin/missions'
        },
        {
            id: 'branches',
            title: 'Branches',
            description: 'Manage locations across different cards.',
            icon: <Globe size={40} />,
            path: '/admin/branches'
        },
    ];

    return (
        <div className="dashboard-container">
            <div className="dashboard-header">
                <button onClick={() => navigate('/admin/dashboard')} className="logout-button" style={{marginBottom:'1rem'}}>
                    <ArrowLeft size={18} style={{marginRight:'5px'}}/> Return to Main Panel
                </button>
                <h1>Landing Page Manager</h1>
                <p>Edit all visible elements on the home page.</p>
            </div>

            <div className="dashboard-grid">
                {landingSections.map((section) => (
                    <div
                        key={section.id}
                        className="dashboard-card"
                        onClick={() => navigate(section.path)}
                    >
                        <div className="card-icon">{section.icon}</div>
                        <h3>{section.title}</h3>
                        <p>{section.description}</p>
                        <span className="card-arrow">Manage →</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ManageLanding;