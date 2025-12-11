import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { db, storage } from '../../firebase/firebase-config';
import { doc, getDoc, setDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import './styles/ManageContent.css';

const ManageContent = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('texts');
    const [loading, setLoading] = useState(false);
    const [uploadingImg, setUploadingImg] = useState(null);

    // Estado gigante para manejar TODO
    const [data, setData] = useState({
        colors: {},
        images: {},
        texts: {
            hero: {}, about: {}, services: {}, mission: {}, footer: {}
        },
        legal: { privacy: '', terms: '', cookies: '' }
    });

    // Cargar datos al iniciar
    useEffect(() => {
        const loadAll = async () => {
            try {
                const [genSnap, textSnap, legalSnap] = await Promise.all([
                    getDoc(doc(db, "siteContent", "generalConfig")),
                    getDoc(doc(db, "siteContent", "textContent")),
                    getDoc(doc(db, "siteContent", "legalContent"))
                ]);

                setData({
                    colors: genSnap.exists() ? genSnap.data().colors || {} : {},
                    images: genSnap.exists() ? genSnap.data().images || {} : {},
                    texts: textSnap.exists() ? textSnap.data() : { hero:{}, about:{}, services:{}, mission:{}, footer:{} },
                    legal: legalSnap.exists() ? legalSnap.data() : { privacy:'', terms:'', cookies:'' }
                });
            } catch (e) { console.error(e); }
        };
        loadAll();
    }, []);

    // Guardado inteligente según la pestaña
    const handleSave = async () => {
        setLoading(true);
        try {
            if (activeTab === 'colors' || activeTab === 'images') {
                await setDoc(doc(db, "siteContent", "generalConfig"), {
                    colors: data.colors,
                    images: data.images
                }, { merge: true });
            }
            else if (activeTab === 'texts') {
                await setDoc(doc(db, "siteContent", "textContent"), data.texts);
            }
            else if (activeTab === 'legal') {
                await setDoc(doc(db, "siteContent", "legalContent"), data.legal);
            }
            alert("¡Guardado con éxito!");
        } catch (e) {
            console.error(e);
            alert("Error al guardar");
        } finally {
            setLoading(false);
        }
    };

    // --- HELPERS ---

    // Para textos
    const handleTextChange = (section, field, value) => {
        setData(prev => ({
            ...prev,
            texts: {
                ...prev.texts,
                [section]: { ...prev.texts[section], [field]: value }
            }
        }));
    };

    // Para colores
    const handleColorChange = (key, value) => {
        setData(prev => ({
            ...prev,
            colors: { ...prev.colors, [key]: value }
        }));
    };

    // Para subir imágenes (Aquí usamos storage, ref, uploadBytes...)
    const handleImageUpload = async (e, imageKey) => {
        const file = e.target.files[0];
        if (!file) return;

        setUploadingImg(imageKey);
        try {
            const storageRef = ref(storage, `site-assets/${imageKey}`);
            await uploadBytes(storageRef, file);
            const url = await getDownloadURL(storageRef);

            setData(prev => ({
                ...prev,
                images: { ...prev.images, [imageKey]: url }
            }));
        } catch (error) {
            console.error("Error subiendo imagen:", error);
            alert("Error al subir la imagen.");
        } finally {
            setUploadingImg(null);
        }
    };

    // Tabs de navegación
    const tabs = [
        { id: 'texts', label: 'Textos Web', icon: '📝' },
        { id: 'legal', label: 'Legal', icon: '⚖️' },
        { id: 'images', label: 'Imágenes', icon: '🖼️' },
        { id: 'colors', label: 'Colores', icon: '🎨' },
    ];

    return (
        <div className="manage-container">
            <div className="manage-header">
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                    <button onClick={() => navigate('/admin/dashboard')} className="back-btn-simple">
                        ← Panel
                    </button>
                    <h1>Editor de Contenido</h1>
                </div>
            </div>

            <div className="manage-tabs">
                {tabs.map(t => (
                    <button
                        key={t.id}
                        className={`tab-button ${activeTab === t.id ? 'active' : ''}`}
                        onClick={() => setActiveTab(t.id)}
                    >
                        {t.icon} {t.label}
                    </button>
                ))}
            </div>

            <div className="manage-content content-section">

                {/* --- PESTAÑA TEXTOS --- */}
                {activeTab === 'texts' && (
                    <div className="form-grid-layout">
                        <h3>Hero Section (Inicio)</h3>
                        <div className="form-group">
                            <label>Título Principal</label>
                            <input value={data.texts.hero?.title || ''} onChange={e => handleTextChange('hero', 'title', e.target.value)} />
                        </div>
                        <div className="form-group">
                            <label>Subtítulo</label>
                            <input value={data.texts.hero?.subtitle || ''} onChange={e => handleTextChange('hero', 'subtitle', e.target.value)} />
                        </div>
                        <div className="form-group">
                            <label>Descripción</label>
                            <textarea value={data.texts.hero?.desc || ''} onChange={e => handleTextChange('hero', 'desc', e.target.value)} />
                        </div>
                        <div className="form-group">
                            <label>Texto Botón</label>
                            <input value={data.texts.hero?.buttonText || ''} onChange={e => handleTextChange('hero', 'buttonText', e.target.value)} />
                        </div>

                        <h3 style={{marginTop:'2rem'}}>About Us</h3>
                        <div className="form-group">
                            <label>Título Sección</label>
                            <input value={data.texts.about?.title || ''} onChange={e => handleTextChange('about', 'title', e.target.value)} />
                        </div>
                        <div className="form-group">
                            <label>Subtítulo</label>
                            <input value={data.texts.about?.subtitle || ''} onChange={e => handleTextChange('about', 'subtitle', e.target.value)} />
                        </div>
                        <div className="form-group">
                            <label>Párrafo destacado</label>
                            <textarea value={data.texts.about?.text1 || ''} onChange={e => handleTextChange('about', 'text1', e.target.value)} />
                        </div>
                        <div className="form-group">
                            <label>Párrafo secundario</label>
                            <textarea value={data.texts.about?.text2 || ''} onChange={e => handleTextChange('about', 'text2', e.target.value)} />
                        </div>

                        <h3 style={{marginTop:'2rem'}}>Misión</h3>
                        <div className="form-group">
                            <label>Título</label>
                            <input value={data.texts.mission?.title || ''} onChange={e => handleTextChange('mission', 'title', e.target.value)} />
                        </div>
                        <div className="form-group">
                            <label>Texto Principal</label>
                            <textarea value={data.texts.mission?.text1 || ''} onChange={e => handleTextChange('mission', 'text1', e.target.value)} />
                        </div>
                        <div className="form-group">
                            <label>Texto Secundario</label>
                            <textarea value={data.texts.mission?.text2 || ''} onChange={e => handleTextChange('mission', 'text2', e.target.value)} />
                        </div>

                        <h3 style={{marginTop:'2rem'}}>Servicios</h3>
                        <div className="form-group">
                            <label>Título</label>
                            <input value={data.texts.services?.title || ''} onChange={e => handleTextChange('services', 'title', e.target.value)} />
                        </div>
                        <div className="form-group">
                            <label>Texto 1</label>
                            <textarea value={data.texts.services?.text1 || ''} onChange={e => handleTextChange('services', 'text1', e.target.value)} />
                        </div>
                        <div className="form-group">
                            <label>Texto 2</label>
                            <textarea value={data.texts.services?.text2 || ''} onChange={e => handleTextChange('services', 'text2', e.target.value)} />
                        </div>

                        <h3 style={{marginTop:'2rem'}}>Footer (Contacto)</h3>
                        <div className="form-group">
                            <label>Dirección física</label>
                            <input value={data.texts.footer?.address || ''} onChange={e => handleTextChange('footer', 'address', e.target.value)} />
                        </div>
                        <div className="form-group">
                            <label>Teléfono</label>
                            <input value={data.texts.footer?.phone || ''} onChange={e => handleTextChange('footer', 'phone', e.target.value)} />
                        </div>
                        <div className="form-group">
                            <label>Email</label>
                            <input value={data.texts.footer?.email || ''} onChange={e => handleTextChange('footer', 'email', e.target.value)} />
                        </div>
                        <div className="form-group">
                            <label>Copyright</label>
                            <input value={data.texts.footer?.copyright || ''} onChange={e => handleTextChange('footer', 'copyright', e.target.value)} />
                        </div>
                    </div>
                )}

                {/* --- PESTAÑA LEGAL --- */}
                {activeTab === 'legal' && (
                    <div>
                        <h3>Editor Legal (HTML)</h3>
                        <p style={{color: '#aaa', marginBottom: '20px'}}>Usa etiquetas HTML básicas (&lt;p&gt;, &lt;h3&gt;, &lt;ul&gt;, &lt;li&gt;).</p>

                        <div className="form-group">
                            <label>Política de Privacidad</label>
                            <textarea
                                rows="10"
                                value={data.legal.privacy || ''}
                                onChange={e => setData(prev => ({...prev, legal: {...prev.legal, privacy: e.target.value}}))}
                            />
                        </div>
                        <div className="form-group">
                            <label>Términos de Uso</label>
                            <textarea
                                rows="10"
                                value={data.legal.terms || ''}
                                onChange={e => setData(prev => ({...prev, legal: {...prev.legal, terms: e.target.value}}))}
                            />
                        </div>
                        <div className="form-group">
                            <label>Política de Cookies</label>
                            <textarea
                                rows="10"
                                value={data.legal.cookies || ''}
                                onChange={e => setData(prev => ({...prev, legal: {...prev.legal, cookies: e.target.value}}))}
                            />
                        </div>
                    </div>
                )}

                {/* --- PESTAÑA IMÁGENES --- */}
                {activeTab === 'images' && (
                    <div className="images-grid">
                        {['logo', 'banner', 'aboutUs', 'ourMission'].map((key) => (
                            <div key={key} className="image-card">
                                <label style={{textTransform:'capitalize'}}>{key}</label>
                                <div className="img-preview">
                                    {data.images?.[key] ? (
                                        <img src={data.images[key]} alt={key} />
                                    ) : (
                                        <span>Sin imagen</span>
                                    )}
                                </div>
                                <input
                                    type="file"
                                    onChange={(e) => handleImageUpload(e, key)}
                                    accept="image/*"
                                    disabled={uploadingImg === key}
                                />
                                {uploadingImg === key && <p style={{color:'var(--gold)'}}>Subiendo...</p>}
                            </div>
                        ))}
                    </div>
                )}

                {/* --- PESTAÑA COLORES --- */}
                {activeTab === 'colors' && (
                    <div className="color-grid">
                        {Object.entries(data.colors).map(([key, value]) => (
                            <div key={key} className="color-item">
                                <label style={{color:'var(--gold)', display:'block', marginBottom:'5px', fontSize:'0.85rem'}}>{key}</label>
                                <div className="color-input-group">
                                    <input type="color" value={value} onChange={(e) => handleColorChange(key, e.target.value)} />
                                    <input type="text" value={value} onChange={(e) => handleColorChange(key, e.target.value)} />
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* --- BOTÓN DE GUARDAR --- */}
                <button className="save-button" onClick={handleSave} disabled={loading}>
                    {loading ? 'Guardando...' : 'Publicar Cambios'}
                </button>
            </div>
        </div>
    );
};

export default ManageContent;