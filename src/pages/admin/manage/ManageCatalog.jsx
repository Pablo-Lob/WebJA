import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './ManageCatalog.css';

const ManageCatalog = () => {
    const navigate = useNavigate();
    const [minerals, setMinerals] = useState([]);
    const [loading, setLoading] = useState(false);

    // Edit State
    const [editingId, setEditingId] = useState(null);

    const [newItem, setNewItem] = useState({ name: '', description: '' });
    const [imageFiles, setImageFiles] = useState([]);

    const API_URL = 'https://itsstonesfzco.com/api.php?table=minerals';

    const fetchMinerals = async () => {
        try {
            const response = await fetch(`${API_URL}&t=${Date.now()}`);
            if (!response.ok) throw new Error("Server error");
            const data = await response.json();
            setMinerals(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error("Error loading catalog:", error);
        }
    };

    useEffect(() => { fetchMinerals(); }, []);

    const handleImageChange = (e) => {
        if (e.target.files) setImageFiles(Array.from(e.target.files));
    };

    // Load data into form
    const handleEdit = (mineral) => {
        setEditingId(mineral.id);
        setNewItem({ name: mineral.name, description: mineral.description });
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const cancelEdit = () => {
        setEditingId(null);
        setNewItem({ name: '', description: '' });
        setImageFiles([]);
        const fileInput = document.getElementById('file-upload');
        if (fileInput) fileInput.value = "";
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const formData = new FormData();
            if (editingId) formData.append('id', editingId);

            formData.append('name', newItem.name);
            formData.append('description', newItem.description);

            imageFiles.forEach((file) => {
                formData.append('images[]', file);
            });

            const response = await fetch(API_URL, {
                method: 'POST',
                body: formData
            });

            const result = await response.json();

            if (result.status === 'success') {
                alert(editingId ? "Mineral updated" : "Mineral created");
                cancelEdit();
                fetchMinerals();
            } else {
                alert("Error: " + (result.error || "Unknown"));
            }
        } catch (error) {
            console.error("Error:", error);
            alert("Connection error");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Delete mineral?")) {
            try {
                await fetch(`${API_URL}&id=${id}`, { method: 'DELETE' });
                fetchMinerals();
            } catch (error) { console.error(error); }
        }
    };

    return (
        <div className="manage-catalog-container">
            <div className="catalog-header">
                <button onClick={() => navigate('/admin/dashboard')} className="back-btn-simple">
                    ← Back
                </button>
                <h1>Catalog Manager</h1>
            </div>

            <div className="admin-grid">
                <div className="upload-section">
                    <div style={{display:'flex', justifyContent:'space-between'}}>
                        <h2>{editingId ? 'Edit Mineral' : 'Add Mineral'}</h2>
                        {editingId && <button onClick={cancelEdit} className="cancel-btn">Cancel</button>}
                    </div>

                    <form onSubmit={handleSubmit}>
                        <input
                            type="text"
                            placeholder="Mineral Name"
                            className="admin-input"
                            value={newItem.name}
                            onChange={e => setNewItem({...newItem, name: e.target.value})}
                            required
                        />
                        <textarea
                            placeholder="Detailed description..."
                            className="admin-textarea"
                            value={newItem.description}
                            onChange={e => setNewItem({...newItem, description: e.target.value})}
                            required
                        />

                        <div className="file-input-wrapper">
                            <label style={{display:'block', marginBottom:'5px', color:'#aaa'}}>
                                {editingId ? 'Add more images (will be appended):' : 'Images:'}
                            </label>
                            <input
                                id="file-upload"
                                type="file"
                                multiple
                                accept="image/*"
                                onChange={handleImageChange}
                                className="file-input"
                                required={!editingId} // Only required if new
                            />
                        </div>

                        <div className="files-preview">
                            {imageFiles.map((f, i) => (
                                <span key={i} className="file-tag">{f.name}</span>
                            ))}
                        </div>

                        <button type="submit" className="save-btn" disabled={loading}>
                            {loading ? 'Saving...' : (editingId ? 'Update' : 'Publish')}
                        </button>
                    </form>
                </div>

                <div className="list-section">
                    <h2>Current Inventory</h2>
                    <div className="minerals-list">
                        {minerals.map(mineral => (
                            <div key={mineral.id} className="mineral-item-admin">
                                {mineral.images && mineral.images[0] ? (
                                    <img src={mineral.images[0]} alt={mineral.name} onError={(e)=>e.target.style.display='none'}/>
                                ) : (
                                    <div className="placeholder-img"></div>
                                )}
                                <div className="mineral-info">
                                    <h3>{mineral.name}</h3>
                                    <small>{mineral.images ? mineral.images.length : 0} images</small>
                                </div>
                                <div className="actions">
                                    <button onClick={() => handleEdit(mineral)} className="edit-btn">Edit</button>
                                    <button onClick={() => handleDelete(mineral.id)} className="delete-btn">Delete</button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ManageCatalog;