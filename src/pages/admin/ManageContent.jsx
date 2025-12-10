import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { db, storage } from '../../firebase/firebase-config';
import { doc, getDoc, setDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import './styles/ManageContent.css'; // Asegúrate de que esta ruta apunte a tu CSS nuevo

const ManageContent = () => {
    const location = useLocation();
    const navigate = useNavigate();

    // Recuperamos la pestaña inicial del estado de navegación (si existe), o usamos 'colors' por defecto
    const [activeTab, setActiveTab] = useState(location.state?.initialTab || 'colors');

    const [loading, setLoading] = useState(false);
    const [uploadingImg, setUploadingImg] = useState(null);

    // Estado unificado de la configuración (Colores e Imágenes)
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
        }
    });

    // Cargar datos de Firebase al montar el componente
    useEffect(() => {
        const fetchData = async () => {
            try {
                const docRef = doc(db, "siteContent", "generalConfig");
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    // Fusionamos los datos para asegurar que no se pierda estructura si faltan campos
                    setConfig(prev => ({ ...prev, ...docSnap.data() }));
                }
            } catch (error) {
                console.error("Error cargando datos:", error);
            }
        };
        fetchData();
    }, []);

    // Método para guardar cambios en Firestore
    const handleSave = async () => {
        setLoading(true);
        try {
            await setDoc(doc(db, "siteContent", "generalConfig"), config);
            alert("¡Configuración guardada y publicada correctamente!");
        } catch (error) {
            console.error("Error al guardar:", error);
            alert("Hubo un error al guardar los cambios.");
        } finally {
            setLoading(false);
        }
    };

    // Lógica de Subida de Imágenes a Storage firebase
    const handleImageUpload = async (e, imageKey) => {
        const file = e.target.files[0];
        if (!file) return;

        setUploadingImg(imageKey); // Activar spinner para esta imagen
        try {
            // Referencia en el bucket: site-assets/nombre-imagen
            const storageRef = ref(storage, `site-assets/${imageKey}`);

            // Subir archivo
            await uploadBytes(storageRef, file);

            // Obtener URL pública
            const url = await getDownloadURL(storageRef);

            // Actualizar estado local
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

    // Gestor de cambios de color
    const handleColorChange = (key, value) => {
        setConfig(prev => ({
            ...prev,
            colors: { ...prev.colors, [key]: value }
        }));
    };

    // Definición de pestañas
    const tabs = [
        { id: 'colors', label: 'Colores', icon: '🎨' },
        { id: 'images', label: 'Imágenes', icon: '🖼️' },
    ];

    return (
        <div className="manage-container">
            {/* Header con botón de volver */}
            <div className="manage-header">
                <div style={{display:'flex', alignItems:'center', gap:'15px'}}>
                    <button onClick={() => navigate('/admin/dashboard')} className="back-btn-simple">
                        ← Panel
                    </button>
                    <h1>Editor de Contenido</h1>
                </div>
            </div>

            {/* Barra de Pestañas */}
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

                {/* --- SECCIÓN DE COLORES --- */}
                {activeTab === 'colors' && (
                    <div className="content-section">
                        <h2>Personalizar Paleta</h2>
                        <p style={{color: '#aaa', marginBottom: '2rem'}}>Define los colores globales de tu marca.</p>

                        <div className="color-grid">
                            {Object.entries(config.colors).map(([key, value]) => (
                                <div key={key} className="color-item">
                                    <label style={{color:'var(--admin-gold)', display:'block', marginBottom:'5px', fontSize:'0.85rem', textTransform:'uppercase'}}>
                                        {key}
                                    </label>
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
                            {loading ? 'Publicando...' : 'Guardar y Publicar Colores'}
                        </button>
                    </div>
                )}

                {/* --- SECCIÓN DE IMÁGENES --- */}
                {activeTab === 'images' && (
                    <div className="content-section">
                        <h2>Gestor de Recursos Visuales</h2>
                        <p style={{marginBottom: '20px', color: '#aaa'}}>Sube nuevas imágenes para actualizar la web al instante.</p>

                        <div className="images-grid">
                            {['logo', 'banner', 'aboutUs', 'ourMission'].map((key) => (
                                <div key={key} className="image-card">
                                    <label>
                                        {key}
                                    </label>

                                    {/* Previsualización */}
                                    <div className="img-preview">
                                        {config.images?.[key] ? (
                                            <img src={config.images[key]} alt={key} />
                                        ) : (
                                            <span style={{ color: '#666', fontSize: '0.9rem' }}>Sin imagen asignada</span>
                                        )}
                                    </div>

                                    {/* Input de archivo */}
                                    <input
                                        type="file"
                                        onChange={(e) => handleImageUpload(e, key)}
                                        accept="image/*"
                                        disabled={uploadingImg === key}
                                    />

                                    {/* Estado de carga */}
                                    {uploadingImg === key && (
                                        <p style={{color: 'var(--admin-gold)', marginTop: '8px', fontSize: '0.85rem', fontWeight: 'bold'}}>
                                            ⏳ Subiendo a la nube...
                                        </p>
                                    )}
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