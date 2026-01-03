import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Save, Home, BookOpen, Phone, FileText, ArrowLeft, Info } from 'lucide-react';
import './ManageContent.css';

const ManageContent = () => {
    const navigate = useNavigate();
    const [config, setConfig] = useState([]);
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState('home');

    const API_URL = 'https://itsstonesfzco.com/api.php?table=siteConfig';

    // 1. Cargar Configuración
    useEffect(() => {
        const fetchConfig = async () => {
            try {
                const response = await fetch(`${API_URL}&t=${Date.now()}`);
                if (response.ok) {
                    const data = await response.json();
                    setConfig(Array.isArray(data) ? data : []);
                }
            } catch (error) {
                console.error("Error loading config:", error);
            }
        };
        fetchConfig();
    }, []);

    const getValue = (key) => {
        const item = config.find(c => c.key === key);
        return item ? item.value : '';
    };

    const handleChange = (key, value) => {
        setConfig(prev => {
            const exists = prev.find(item => item.key === key);
            if (exists) {
                return prev.map(item => item.key === key ? { ...item, value } : item);
            }
            return [...prev, { key, value }];
        });
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const dataToSend = config.filter(item => item.value !== null);
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(dataToSend)
            });
            const result = await response.json();
            if (result.status === 'success') alert("Content updated successfully!");
            else alert("Error saving: " + (result.error || "Unknown error"));
        } catch (error) {
            console.error(error);
            alert("Connection error");
        } finally {
            setLoading(false);
        }
    };

    const renderInput = (label, key, placeholder, isTextarea = false) => (
        <div className="form-group">
            <label>{label}</label>
            {isTextarea ? (
                <textarea
                    rows={5}
                    placeholder={placeholder}
                    value={getValue(key)}
                    onChange={(e) => handleChange(key, e.target.value)}
                />
            ) : (
                <input
                    type="text"
                    placeholder={placeholder}
                    value={getValue(key)}
                    onChange={(e) => handleChange(key, e.target.value)}
                />
            )}
        </div>
    );

    return (
        <div className="manage-container">
            <div className="manage-header">
                <div style={{display:'flex', alignItems:'center', gap:'15px'}}>
                    <button onClick={() => navigate('/admin/dashboard/landing-page')} className="back-link" style={{background:'none', border:'none', cursor:'pointer', fontSize:'1rem'}}>
                        <ArrowLeft size={20}/> Back to Landing
                    </button>
                    <h1>General Content Editor</h1>
                </div>
                <button onClick={handleSave} className="save-button" style={{width:'auto', marginTop:0, display:'flex', alignItems:'center', gap:'10px'}} disabled={loading}>
                    <Save size={20} /> {loading ? 'Saving...' : 'Save Changes'}
                </button>
            </div>

            {/* Pestañas */}
            <div className="manage-tabs">
                <button className={`tab-button ${activeTab === 'home' ? 'active' : ''}`} onClick={() => setActiveTab('home')}>
                    <Home size={18} /> Hero (Home)
                </button>
                <button className={`tab-button ${activeTab === 'about' ? 'active' : ''}`} onClick={() => setActiveTab('about')}>
                    <Info size={18} /> About Us
                </button>
                <button className={`tab-button ${activeTab === 'mission' ? 'active' : ''}`} onClick={() => setActiveTab('mission')}>
                    <BookOpen size={18} /> Mission
                </button>
                <button className={`tab-button ${activeTab === 'contact' ? 'active' : ''}`} onClick={() => setActiveTab('contact')}>
                    <Phone size={18} /> Contact Info
                </button>
                <button className={`tab-button ${activeTab === 'legal' ? 'active' : ''}`} onClick={() => setActiveTab('legal')}>
                    <FileText size={18} /> Legal Pages
                </button>
            </div>

            {/* Contenido */}
            <div className="manage-content">
                <form onSubmit={handleSave} className="content-section">

                    {activeTab === 'home' && (
                        <>
                            <h2>Hero Section</h2>
                            <p style={{color:'#aaa', marginBottom:'20px'}}>Content for the main banner.</p>
                            {renderInput("Main Title", "hero_title", "Ex: ITS-STONES")}
                            {renderInput("Subtitle", "hero_subtitle", "Ex: Precious Metals & Gems Import")}
                            {renderInput("Description Text", "hero_text", "Short description...", true)}
                            {renderInput("Button Text", "hero_cta_text", "Ex: Contact Us")}
                        </>
                    )}

                    {activeTab === 'about' && (
                        <>
                            <h2>About Us Section</h2>
                            <p style={{color:'#aaa', marginBottom:'20px'}}>Introduction text about the company.</p>
                            {renderInput("Section Title", "about_title", "Ex: About Us")}
                            {renderInput("Main Text", "about_text", "Company history and description...", true)}
                        </>
                    )}

                    {activeTab === 'mission' && (
                        <>
                            <h2>Mission & Vision</h2>
                            {renderInput("Section Title", "mission_title", "Ex: Our Mission")}
                            {renderInput("Top Paragraph", "mission_text_top", "Primary mission statement...", true)}
                            {renderInput("Bottom Paragraph", "mission_text_bottom", "Secondary vision statement...", true)}
                        </>
                    )}

                    {activeTab === 'contact' && (
                        <>
                            <h2>Contact Information</h2>
                            <p style={{color:'#aaa', marginBottom:'20px'}}>Used in Footer and Contact Page.</p>
                            {renderInput("Email Address", "contact_email", "info@itsstonesfzco.com")}
                            {renderInput("Phone Number", "contact_phone", "+971 50 ...")}
                            {renderInput("Address", "contact_address", "Dubai Airport Free Zone...")}
                            {renderInput("Copyright Text", "footer_copyright", "© 2025 ITS Stones...")}
                        </>
                    )}

                    {activeTab === 'legal' && (
                        <>
                            <h2>Legal Documents</h2>
                            <p style={{marginBottom:'20px', color:'#ccc'}}>HTML tags supported.</p>
                            {renderInput("Privacy Policy", "privacy_policy", "Paste HTML...", true)}
                            {renderInput("Terms & Conditions", "terms_of_service", "Paste HTML...", true)}
                            {renderInput("Cookie Policy", "cookie_policy", "Paste HTML...", true)}
                            {renderInput("Cookie Banner", "cookie_banner_text", "Short notice text...", true)}
                        </>
                    )}

                </form>
            </div>
        </div>
    );
};

export default ManageContent;