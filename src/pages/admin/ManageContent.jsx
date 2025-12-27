import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Save, Home, BookOpen, Phone, FileText, ArrowLeft } from 'lucide-react';
import './styles/ManageContent.css';

const ManageContent = () => {
    const navigate = useNavigate();
    const [config, setConfig] = useState([]);
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState('home');

    // URL de tu API para la tabla de configuración
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
                console.error("Error cargando configuración:", error);
            }
        };
        fetchConfig();
    }, []);

    // Helper: Obtener valor de una clave
    const getValue = (key) => {
        const item = config.find(c => c.key === key);
        return item ? item.value : '';
    };

    // Helper: Actualizar estado local
    const handleChange = (key, value) => {
        setConfig(prev => {
            const exists = prev.find(item => item.key === key);
            if (exists) {
                return prev.map(item => item.key === key ? { ...item, value } : item);
            }
            return [...prev, { key, value }];
        });
    };

    // 2. Guardar Todo
    const handleSave = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            // Filtramos valores vacíos o nulos para limpiar
            const dataToSend = config.filter(item => item.value !== null);

            const response = await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(dataToSend)
            });

            const result = await response.json();
            if (result.status === 'success') {
                alert("¡Contenido actualizado correctamente!");
            } else {
                alert("Error al guardar: " + (result.error || "Desconocido"));
            }
        } catch (error) {
            console.error(error);
            alert("Error de conexión");
        } finally {
            setLoading(false);
        }
    };

    // Renderizar inputs de forma limpia
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
                    <button onClick={() => navigate('/admin/dashboard')} className="back-link" style={{background:'none', border:'none', cursor:'pointer', fontSize:'1rem'}}>
                        <ArrowLeft size={20}/> Volver
                    </button>
                    <h1>Editor de Contenidos</h1>
                </div>
                <button onClick={handleSave} className="save-button" style={{width:'auto', marginTop:0, display:'flex', alignItems:'center', gap:'10px'}} disabled={loading}>
                    <Save size={20} /> {loading ? 'Guardando...' : 'Guardar Cambios'}
                </button>
            </div>

            {/* Pestañas de Navegación */}
            <div className="manage-tabs">
                <button className={`tab-button ${activeTab === 'home' ? 'active' : ''}`} onClick={() => setActiveTab('home')}>
                    <Home size={18} /> Inicio (Hero)
                </button>
                <button className={`tab-button ${activeTab === 'mission' ? 'active' : ''}`} onClick={() => setActiveTab('mission')}>
                    <BookOpen size={18} /> Misión
                </button>
                <button className={`tab-button ${activeTab === 'contact' ? 'active' : ''}`} onClick={() => setActiveTab('contact')}>
                    <Phone size={18} /> Contacto
                </button>
                <button className={`tab-button ${activeTab === 'legal' ? 'active' : ''}`} onClick={() => setActiveTab('legal')}>
                    <FileText size={18} /> Legal
                </button>
            </div>

            {/* Contenido del Formulario */}
            <div className="manage-content">
                <form onSubmit={handleSave} className="content-section">

                    {activeTab === 'home' && (
                        <>
                            <h2>Sección Principal (Hero)</h2>
                            {renderInput("Título Principal", "hero_title", "Ej: ITS-STONES")}
                            {renderInput("Subtítulo", "hero_subtitle", "Ej: Precious Metals & Gems Import")}
                            {renderInput("Texto Descriptivo", "hero_text", "Descripción corta del banner...")}
                            {renderInput("Texto del Botón", "hero_cta_text", "Ej: Contact Us")}
                            <p style={{fontSize:'0.9rem', color:'#aaa', marginTop:'10px'}}>* La imagen del banner se gestiona subiendo un archivo llamado 'banner.webp' en la carpeta assets o vía FTP por ahora.</p>
                        </>
                    )}

                    {activeTab === 'mission' && (
                        <>
                            <h2>Nuestra Misión</h2>
                            {renderInput("Título", "mission_title", "Ej: Our Mission")}
                            {renderInput("Párrafo Superior", "mission_text_top", "Texto principal de la misión...", true)}
                            {renderInput("Párrafo Inferior", "mission_text_bottom", "Texto secundario o visión...", true)}
                        </>
                    )}

                    {activeTab === 'contact' && (
                        <>
                            <h2>Datos de Contacto (Pie de página)</h2>
                            {renderInput("Correo Electrónico", "contact_email", "info@itsstonesfzco.com")}
                            {renderInput("Teléfono", "contact_phone", "+971 50 ...")}
                            {renderInput("Dirección Física", "contact_address", "Dubai Airport Free Zone...")}
                            {renderInput("Texto Copyright", "footer_copyright", "© 2025 ITS Stones...")}
                        </>
                    )}

                    {activeTab === 'legal' && (
                        <>
                            <h2>Páginas Legales (Admite HTML básico)</h2>
                            <p style={{marginBottom:'20px', color:'#ccc'}}>Puedes usar etiquetas como <code>&lt;p&gt;</code>, <code>&lt;br&gt;</code>, <code>&lt;strong&gt;</code>.</p>
                            {renderInput("Política de Privacidad", "privacy_policy", "Contenido HTML...", true)}
                            {renderInput("Términos y Condiciones", "terms_of_service", "Contenido HTML...", true)}
                            {renderInput("Política de Cookies", "cookie_policy", "Contenido HTML...", true)}
                            {renderInput("Banner de Cookies (Texto corto)", "cookie_banner_text", "Utilizamos cookies para...", true)}
                        </>
                    )}

                </form>
            </div>
        </div>
    );
};

export default ManageContent;