import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Save, ArrowLeft, Image as ImageIcon } from 'lucide-react';
import './styles/ManageContent.css';

const ManageAbout = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const [aboutData, setAboutData] = useState({
        about_title: '',
        about_text: ''
    });
    const [imageFile, setImageFile] = useState(null);
    const [currentImage, setCurrentImage] = useState('');

    const API_URL = 'https://itsstonesfzco.com/api.php?table=siteConfig';

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch(`${API_URL}&t=${Date.now()}`);
                const data = await res.json();
                if (Array.isArray(data)) {
                    setAboutData({
                        about_title: data.find(i => i.key === 'about_title')?.value || '',
                        about_text: data.find(i => i.key === 'about_text')?.value || ''
                    });
                    const imgItem = data.find(i => i.key === 'about_image');
                    if (imgItem) setCurrentImage(imgItem.value);
                }
            } catch (e) { console.error(e); }
        };
        fetchData();
    }, []);

    const handleSave = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const formData = new FormData();
            formData.append('about_title', aboutData.about_title);
            formData.append('about_text', aboutData.about_text);
            if (imageFile) formData.append('about_image', imageFile);

            const response = await fetch(API_URL, { method: 'POST', body: formData });
            const result = await response.json();
            if (result.status === 'success') {
                alert("About Us updated!");
                if (result.image_url) setCurrentImage(result.image_url);
            } else {
                alert("Error: " + result.error);
            }
        } catch (error) { alert("Connection error"); }
        finally { setLoading(false); }
    };

    return (
        <div className="manage-container">
            <div className="manage-header">
                <button onClick={() => navigate('/admin/landing')} className="back-link">
                    <ArrowLeft size={20}/> Back
                </button>
                <h1>Manage About Us</h1>
            </div>

            <div className="manage-content">
                <form onSubmit={handleSave} className="content-section">
                    <div className="form-group">
                        <label>Title</label>
                        <input
                            type="text"
                            value={aboutData.about_title}
                            onChange={e => setAboutData({...aboutData, about_title: e.target.value})}
                        />
                    </div>
                    <div className="form-group">
                        <label>Main Text</label>
                        <textarea
                            rows={8}
                            value={aboutData.about_text}
                            onChange={e => setAboutData({...aboutData, about_text: e.target.value})}
                        />
                    </div>
                    <div className="form-group" style={{marginTop:'20px'}}>
                        <label><ImageIcon size={18}/> Section Image</label>
                        {currentImage && <img src={currentImage} alt="About" style={{maxHeight:'100px', display:'block', margin:'10px 0'}} />}
                        <input type="file" accept="image/*" onChange={e => setImageFile(e.target.files[0])} />
                    </div>
                    <button type="submit" className="save-button" disabled={loading}>
                        <Save size={20} /> {loading ? 'Saving...' : 'Update About Us'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ManageAbout;