import React, { useState, useEffect } from 'react';
import { db, storage } from '../../firebase/firebase-config'; // Importamos storage
import { doc, getDoc, setDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage"; // Funciones de Storage
import './ManageContent.css';

const ManageContent = () => {
    const [activeTab, setActiveTab] = useState('colors');
    const [loading, setLoading] = useState(false);
    const [uploadingImg, setUploadingImg] = useState(null);

    const [config, setConfig] = useState({
        colors: {
            goldPrimary: '#d4af37',
            goldSecondary: '#f7e695',
            goldAccent: '#ecd26b',
            goldHover: '#b8860b',
            goldDim: 'rgba(212, 175, 55, 0.2)',
            bgBlack: '#000000',
            bgDark: '#0f0f0f',
            bgSecondary: '#1a1a1a',
            bgCard: 'rgba(255, 255, 255, 0.05)',
            bgInput: '#ffffff',
            textWhite: '#ffffff',
            textGray: '#a0a0a0',
            textLightGray: '#cccccc',
            textDark: '#333333',
            textButton: '#F5F5F5'
        },
        images: {
            logo: '',
            banner: '',
            aboutUs: '',
            ourMission: ''
        },
    });

    // Cargar configuración existente
    useEffect(() => {
        const fetchData = async () => {
            const docRef = doc(db, "siteContent", "generalConfig");
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                setConfig(prev => ({ ...prev, ...docSnap.data() }));
            }
        };
        fetchData();
    }, []);

    const handleSave = async () => {
        setLoading(true);
        try {
            await setDoc(doc(db, "siteContent", "generalConfig"), config);
            alert("¡Configuración guardada correctamente!");
        } catch (error) {
            console.error(error);
            alert("Error al guardar");
        }
        setLoading(false);
    };

    // --- Lógica de Subida de Imágenes ---
    const handleImageUpload = async (e, imageKey) => {
        const file = e.target.files[0];
        if (!file) return;

        setUploadingImg(imageKey);
        try {
            // 1. Crear referencia (ej: site-assets/logo.png)
            const storageRef = ref(storage, `site-assets/${imageKey}`);

            // 2. Subir archivo
            await uploadBytes(storageRef, file);

            // 3. Obtener URL pública
            const url = await getDownloadURL(storageRef);

            // 4. Actualizar estado local
            setConfig(prev => ({
                ...prev,
                images: {
                    ...prev.images,
                    [imageKey]: url
                }
            }));
        } catch (error) {
            console.error("Error subiendo imagen:", error);
            alert("Error al subir la imagen. Verifica tu conexión.");
        } finally {
            setUploadingImg(null);
        }
    };

    const handleColorChange = (key, value) => {
        setConfig(prev => ({
            ...prev,
            colors: { ...prev.colors, [key]: value }
        }));
    };

    const tabs = [
        { id: 'colors', label: 'Colores', icon: '🎨' },
        { id: 'images', label: 'Imágenes', icon: '🖼️' },
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

                {/* Pestaña de Colores */}
                {activeTab === 'colors' && (
                    <div className="content-section">
                        <h2>Personalizar Colores</h2>
                        <div className="color-grid">
                            {Object.entries(config.colors).map(([key, value]) => (
                                <div key={key} className="color-item">
                                    <label>{key}</label>
                                    <div className="color-input-group">
                                        <input
                                            type="color"
                                            value={value}
                                            onChange={(e) => handleColorChange(key, e.target.value)}
                                        />
                                        <input
                                            type="text"
                                            value={value}
                                            onChange={(e) => handleColorChange(key, e.target.value)}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                        <button className="save-button" onClick={handleSave} disabled={loading}>
                            {loading ? 'Guardando...' : 'Guardar Colores'}
                        </button>
                    </div>
                )}

                {/* Pestaña de Imágenes */}
                {activeTab === 'images' && (
                    <div className="content-section">
                        <h2>Imágenes Globales</h2>
                        <p style={{marginBottom: '20px', color: '#aaa'}}>Estas imágenes se actualizan en tiempo real en la web al subir una nueva.</p>

                        <div className="images-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
                            {['logo', 'banner', 'aboutUs', 'ourMission'].map((key) => (
                                <div key={key} className="image-card" style={{ background: 'rgba(255,255,255,0.05)', padding: '15px', borderRadius: '10px' }}>
                                    <label style={{ textTransform: 'capitalize', display: 'block', marginBottom: '10px', color: 'var(--gold)' }}>
                                        {key}
                                    </label>

                                    <div className="img-preview" style={{ height: '150px', background: '#000', marginBottom: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px dashed #444' }}>
                                        {config.images?.[key] ? (
                                            <img src={config.images[key]} alt={key} style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain' }} />
                                        ) : (
                                            <span style={{ color: '#666' }}>Sin imagen</span>
                                        )}
                                    </div>

                                    <input
                                        type="file"
                                        onChange={(e) => handleImageUpload(e, key)}
                                        accept="image/*"
                                        disabled={uploadingImg === key}
                                        style={{ width: '100%', color: '#ccc', fontSize: '0.9rem' }}
                                    />
                                    {uploadingImg === key && <p style={{color: 'var(--gold)', marginTop: '5px'}}>Subiendo...</p>}
                                </div>
                            ))}
                        </div>

                        <button className="save-button" onClick={handleSave} disabled={loading}>
                            {loading ? 'Guardando...' : 'Confirmar Cambios'}
                        </button>
                    </div>
                )}

            </div>
        </div>
    );
};

export default ManageContent;