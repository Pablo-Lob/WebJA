// File: src/pages/admin/ManageContent.jsx
import React, { useState } from 'react';
import './ManageContent.css';

const ManageContent = () => {
    const [activeTab, setActiveTab] = useState('colors');

    // Estados para cada sección
    const [colors, setColors] = useState({
        primary: '#667eea',
        secondary: '#764ba2',
        accent: '#f6ad55'
    });

    const [banner, setBanner] = useState({
        title: 'Minerales de Alta Calidad',
        description: 'Los mejores minerales para tu industria',
        image: ''
    });

    const [b2bContent, setB2bContent] = useState({
        title: 'Soluciones B2B',
        features: [
            'Pedidos personalizados',
            'Asesoría técnica especializada',
            'Logística optimizada',
            'Certificaciones internacionales'
        ]
    });

    const [targetAudience, setTargetAudience] = useState([
        {
            title: 'Industrias',
            description: 'Soluciones para manufactura y producción',
            icon: '🏭'
        },
        {
            title: 'Constructoras',
            description: 'Materiales de construcción certificados',
            icon: '🏗️'
        },
        {
            title: 'Laboratorios',
            description: 'Minerales para investigación y análisis',
            icon: '🔬'
        }
    ]);

    const handleColorChange = (colorType, value) => {
        setColors({...colors, [colorType]: value});
    };

    const handleSave = (section) => {
        // Implementar guardado en backend
        alert(`Guardando cambios en ${section}...`);
    };

    const tabs = [
        { id: 'colors', label: 'Colores', icon: '🎨' },
        { id: 'banner', label: 'Banner', icon: '🖼️' },
        { id: 'b2b', label: 'B2B', icon: '🤝' },
        { id: 'target', label: 'Para Quién', icon: '👥' }
    ];

    return (
        <div className="manage-container">
            <div className="manage-header">
                <h1>Gestión de Contenido</h1>
                <a href="/admin/dashboard" className="back-link">← Volver al panel</a>
            </div>

            <div className="manage-tabs">
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
                        onClick={() => setActiveTab(tab.id)}
                    >
                        <span className="tab-icon">{tab.icon}</span>
                        {tab.label}
                    </button>
                ))}
            </div>

            <div className="manage-content">
                {/* Sección de Colores */}
                {activeTab === 'colors' && (
                    <div className="content-section">
                        <h2>Personalizar Colores</h2>

                        <div className="color-grid">
                            <div className="color-item">
                                <label>Color Primario</label>
                                <div className="color-input-group">
                                    <input
                                        type="color"
                                        value={colors.primary}
                                        onChange={(e) => handleColorChange('primary', e.target.value)}
                                    />
                                    <input
                                        type="text"
                                        value={colors.primary}
                                        onChange={(e) => handleColorChange('primary', e.target.value)}
                                        placeholder="#667eea"
                                    />
                                </div>
                            </div>

                            <div className="color-item">
                                <label>Color Secundario</label>
                                <div className="color-input-group">
                                    <input
                                        type="color"
                                        value={colors.secondary}
                                        onChange={(e) => handleColorChange('secondary', e.target.value)}
                                    />
                                    <input
                                        type="text"
                                        value={colors.secondary}
                                        onChange={(e) => handleColorChange('secondary', e.target.value)}
                                        placeholder="#764ba2"
                                    />
                                </div>
                            </div>

                            <div className="color-item">
                                <label>Color de Acento</label>
                                <div className="color-input-group">
                                    <input
                                        type="color"
                                        value={colors.accent}
                                        onChange={(e) => handleColorChange('accent', e.target.value)}
                                    />
                                    <input
                                        type="text"
                                        value={colors.accent}
                                        onChange={(e) => handleColorChange('accent', e.target.value)}
                                        placeholder="#f6ad55"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="color-preview">
                            <h3>Vista Previa</h3>
                            <div
                                className="preview-box"
                                style={{
                                    background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`
                                }}
                            >
                                <button style={{background: colors.accent}}>
                                    Botón de Ejemplo
                                </button>
                            </div>
                        </div>

                        <button className="save-button" onClick={() => handleSave('colors')}>
                            Guardar Colores
                        </button>
                    </div>
                )}

                {/* Sección de Banner */}
                {activeTab === 'banner' && (
                    <div className="content-section">
                        <h2>Editar Banner Principal</h2>

                        <div className="form-group">
                            <label>Título del Banner</label>
                            <input
                                type="text"
                                value={banner.title}
                                onChange={(e) => setBanner({...banner, title: e.target.value})}
                                placeholder="Título principal"
                            />
                        </div>

                        <div className="form-group">
                            <label>Descripción</label>
                            <textarea
                                value={banner.description}
                                onChange={(e) => setBanner({...banner, description: e.target.value})}
                                placeholder="Descripción del banner"
                                rows="3"
                            />
                        </div>

                        <div className="form-group">
                            <label>Imagen de Fondo</label>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => {
                                    const file = e.target.files[0];
                                    if (file) {
                                        setBanner({...banner, image: URL.createObjectURL(file)});
                                    }
                                }}
                            />
                            {banner.image && (
                                <div className="image-preview">
                                    <img src={banner.image} alt="Preview" />
                                </div>
                            )}
                        </div>

                        <button className="save-button" onClick={() => handleSave('banner')}>
                            Guardar Banner
                        </button>
                    </div>
                )}

                {/* Sección B2B */}
                {activeTab === 'b2b' && (
                    <div className="content-section">
                        <h2>Contenido B2B</h2>

                        <div className="form-group">
                            <label>Título de la Sección</label>
                            <input
                                type="text"
                                value={b2bContent.title}
                                onChange={(e) => setB2bContent({...b2bContent, title: e.target.value})}
                            />
                        </div>

                        <div className="form-group">
                            <label>Características (una por línea)</label>
                            <textarea
                                value={b2bContent.features.join('\n')}
                                onChange={(e) => setB2bContent({
                                    ...b2bContent,
                                    features: e.target.value.split('\n')
                                })}
                                rows="6"
                            />
                        </div>

                        <button className="save-button" onClick={() => handleSave('b2b')}>
                            Guardar B2B
                        </button>
                    </div>
                )}

                {/* Sección Para Quién */}
                {activeTab === 'target' && (
                    <div className="content-section">
                        <h2>¿Para Quién Es Esto?</h2>

                        {targetAudience.map((item, index) => (
                            <div key={index} className="target-card-edit">
                                <div className="form-group">
                                    <label>Emoji/Icono</label>
                                    <input
                                        type="text"
                                        value={item.icon}
                                        onChange={(e) => {
                                            const newTarget = [...targetAudience];
                                            newTarget[index].icon = e.target.value;
                                            setTargetAudience(newTarget);
                                        }}
                                        maxLength="2"
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Título</label>
                                    <input
                                        type="text"
                                        value={item.title}
                                        onChange={(e) => {
                                            const newTarget = [...targetAudience];
                                            newTarget[index].title = e.target.value;
                                            setTargetAudience(newTarget);
                                        }}
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Descripción</label>
                                    <input
                                        type="text"
                                        value={item.description}
                                        onChange={(e) => {
                                            const newTarget = [...targetAudience];
                                            newTarget[index].description = e.target.value;
                                            setTargetAudience(newTarget);
                                        }}
                                    />
                                </div>
                            </div>
                        ))}

                        <button className="save-button" onClick={() => handleSave('target')}>
                            Guardar Audiencia
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ManageContent;