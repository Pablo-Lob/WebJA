import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Save, ArrowLeft, Image as ImageIcon } from 'lucide-react';
import './ManageContent.css'; // Usamos los mismos estilos

const ManageHero = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    // Estado para los textos
    const [heroData, setHeroData] = useState({
        hero_title: '',
        hero_subtitle: '',
        hero_text: '',
        hero_cta_text: ''
    });

    // Estado para la imagen
    const [imageFile, setImageFile] = useState(null);
    const [currentImage, setCurrentImage] = useState(''); // Para mostrar la actual si existe

    const API_URL = 'https://itsstonesfzco.com/api.php?table=siteConfig';

    // 1. Cargar Datos
    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch(`${API_URL}&t=${Date.now()}`);
                const data = await res.json();
                if (Array.isArray(data)) {
                    // Extraer textos
                    setHeroData({
                        hero_title: data.find(i => i.key === 'hero_title')?.value || '',
                        hero_subtitle: data.find(i => i.key === 'hero_subtitle')?.value || '',
                        hero_text: data.find(i => i.key === 'hero_text')?.value || '',
                        hero_cta_text: data.find(i => i.key === 'hero_cta_text')?.value || ''
                    });
                    // Extraer imagen actual (si tu API devuelve la URL en una key 'hero_image')
                    const imgItem = data.find(i => i.key === 'hero_image');
                    if (imgItem) setCurrentImage(imgItem.value);
                }
            } catch (e) { console.error(e); }
        };
        fetchData();
    }, []);

    // 2. Guardar (FormData para soportar imagen)
    const handleSave = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const formData = new FormData();
            // Añadimos textos como key/value
            formData.append('hero_title', heroData.hero_title);
            formData.append('hero_subtitle', heroData.hero_subtitle);
            formData.append('hero_text', heroData.hero_text);
            formData.append('hero_cta_text', heroData.hero_cta_text);

            // Añadimos imagen si se seleccionó una nueva
            if (imageFile) {
                formData.append('hero_image', imageFile);
            }

            // Nota: Tu PHP debe estar preparado para recibir $_POST['hero_title'] y $_FILES['hero_image']
            // Si tu PHP actual solo acepta JSON para siteConfig, avísame para ajustar esto.
            const response = await fetch(API_URL, {
                method: 'POST',
                body: formData
            });

            const result = await response.json();
            if (result.status === 'success') {
                alert("Hero section updated successfully!");
                // Actualizar vista previa si se subió imagen
                if (result.image_url) setCurrentImage(result.image_url);
            } else {
                alert("Error: " + (result.error || "Unknown error"));
            }
        } catch (error) {
            console.error(error);
            alert("Connection error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="manage-container">
            <div className="manage-header">
                <button onClick={() => navigate('/admin/dashboard/landing-page')} className="back-link">
                    <ArrowLeft size={20}/> Back to Landing
                </button>
                <h1>Manage Hero Section</h1>
            </div>

            <div className="manage-content">
                <form onSubmit={handleSave} className="content-section">
                    <div className="form-group">
                        <label>Main Title</label>
                        <input
                            type="text"
                            value={heroData.hero_title}
                            onChange={e => setHeroData({...heroData, hero_title: e.target.value})}
                            placeholder="Ex: ITS-STONES"
                        />
                    </div>

                    <div className="form-group">
                        <label>Subtitle</label>
                        <input
                            type="text"
                            value={heroData.hero_subtitle}
                            onChange={e => setHeroData({...heroData, hero_subtitle: e.target.value})}
                            placeholder="Ex: Precious Metals Import"
                        />
                    </div>

                    <div className="form-group">
                        <label>Description</label>
                        <textarea
                            rows={4}
                            value={heroData.hero_text}
                            onChange={e => setHeroData({...heroData, hero_text: e.target.value})}
                            placeholder="Short description..."
                        />
                    </div>

                    <div className="form-group">
                        <label>Button Text</label>
                        <input
                            type="text"
                            value={heroData.hero_cta_text}
                            onChange={e => setHeroData({...heroData, hero_cta_text: e.target.value})}
                            placeholder="Ex: Contact Us"
                        />
                    </div>

                    <div className="form-group" style={{marginTop:'20px', borderTop:'1px solid #444', paddingTop:'20px'}}>
                        <label style={{display:'flex', alignItems:'center', gap:'10px'}}>
                            <ImageIcon size={20}/> Background Image
                        </label>

                        {currentImage && (
                            <div style={{marginBottom:'10px'}}>
                                <p style={{fontSize:'0.8rem', color:'#aaa'}}>Current Image:</p>
                                <img src={currentImage} alt="Current Hero" style={{maxHeight:'100px', borderRadius:'5px'}} />
                            </div>
                        )}

                        <input
                            type="file"
                            accept="image/*"
                            onChange={e => setImageFile(e.target.files[0])}
                            className="file-input"
                        />
                        <p style={{fontSize:'0.8rem', color:'#888'}}>Recommended size: 1920x1080px (WebP or JPG)</p>
                    </div>

                    <button type="submit" className="save-button" disabled={loading}>
                        <Save size={20} /> {loading ? 'Saving...' : 'Update Hero'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ManageHero;