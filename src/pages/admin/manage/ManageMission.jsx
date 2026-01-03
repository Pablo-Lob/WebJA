import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Save, ArrowLeft, Image as ImageIcon } from 'lucide-react';
import './ManageContent.css';

const ManageMission = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const [missionData, setMissionData] = useState({
        mission_title: '',
        mission_text_top: '',
        mission_text_bottom: ''
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
                    setMissionData({
                        mission_title: data.find(i => i.key === 'mission_title')?.value || '',
                        mission_text_top: data.find(i => i.key === 'mission_text_top')?.value || '',
                        mission_text_bottom: data.find(i => i.key === 'mission_text_bottom')?.value || ''
                    });
                    const imgItem = data.find(i => i.key === 'mission_image');
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
            formData.append('mission_title', missionData.mission_title);
            formData.append('mission_text_top', missionData.mission_text_top);
            formData.append('mission_text_bottom', missionData.mission_text_bottom);
            if (imageFile) formData.append('mission_image', imageFile);

            const response = await fetch(API_URL, { method: 'POST', body: formData });
            const result = await response.json();
            if (result.status === 'success') {
                alert("Mission updated successfully!");
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
                <button onClick={() => navigate('/admin/dashboard/landing-page')} className="back-link">
                    <ArrowLeft size={20}/> Back to Landing
                </button>
                <h1>Manage Mission</h1>
            </div>

            <div className="manage-content">
                <form onSubmit={handleSave} className="content-section">
                    <div className="form-group">
                        <label>Section Title</label>
                        <input
                            type="text"
                            value={missionData.mission_title}
                            onChange={e => setMissionData({...missionData, mission_title: e.target.value})}
                        />
                    </div>
                    <div className="form-group">
                        <label>Top Paragraph (Mission)</label>
                        <textarea
                            rows={4}
                            value={missionData.mission_text_top}
                            onChange={e => setMissionData({...missionData, mission_text_top: e.target.value})}
                        />
                    </div>
                    <div className="form-group">
                        <label>Bottom Paragraph (Vision)</label>
                        <textarea
                            rows={4}
                            value={missionData.mission_text_bottom}
                            onChange={e => setMissionData({...missionData, mission_text_bottom: e.target.value})}
                        />
                    </div>
                    <div className="form-group" style={{marginTop:'20px'}}>
                        <label><ImageIcon size={18}/> Mission Image</label>
                        {currentImage && <img src={currentImage} alt="Mission" style={{maxHeight:'100px', display:'block', margin:'10px 0'}} />}
                        <input type="file" accept="image/*" onChange={e => setImageFile(e.target.files[0])} />
                    </div>
                    <button type="submit" className="save-button" disabled={loading}>
                        <Save size={20} /> {loading ? 'Saving...' : 'Update Mission'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ManageMission;