import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Importante para volver al dashboard
import './ManageBlog.css';

const ManageBlog = () => {
    const navigate = useNavigate();
    const [view, setView] = useState('list'); // 'list' | 'create' | 'edit'

    // Form Data State
    const [formData, setFormData] = useState({
        title: '',
        slug: '',
        excerpt: '',
        content: '',
        category: '',
        newCategory: '', // For custom category creation
        metaTitle: '',
        metaDesc: ''
    });

    // Files State
    const [coverImage, setCoverImage] = useState(null);
    const [coverPreview, setCoverPreview] = useState(null);
    const [isCustomCategory, setIsCustomCategory] = useState(false);

    // Simulated Categories
    const [categories, setCategories] = useState(['Market', 'Sustainability', 'Logistics', 'Projects']);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Category Logic
    const handleCategoryChange = (e) => {
        const value = e.target.value;
        if (value === 'NEW_CUSTOM') {
            setIsCustomCategory(true);
            setFormData({ ...formData, category: '' });
        } else {
            setIsCustomCategory(false);
            setFormData({ ...formData, category: value });
        }
    };

    // Cover Image Logic
    const handleCoverImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setCoverImage(file);
            setCoverPreview(URL.createObjectURL(file));
        }
    };

    // "Insert Image into Content" Logic (Simulation)
    const handleContentImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            // HERE YOU WOULD CALL YOUR API TO UPLOAD THE FILE
            const fakeUrl = URL.createObjectURL(file);

            // Insert HTML img tag into content textarea
            const imgTag = `\n<img src="${fakeUrl}" alt="Description" style="width:100%; border-radius:4px; margin: 20px 0;" />\n`;
            setFormData(prev => ({
                ...prev,
                content: prev.content + imgTag
            }));

            alert("Image inserted at the end of content (Simulation).");
        }
    };

    const handleSave = (e) => {
        e.preventDefault();

        // Determine final category
        const finalCategory = isCustomCategory ? formData.newCategory : formData.category;

        console.log("Saving Article...");
        console.log("Data:", { ...formData, category: finalCategory });
        console.log("Cover File:", coverImage);

        alert("Article Saved (Check Console)");
        // setView('list');
    };

    return (
        <div className="admin-blog-container">
            <div className="admin-header">
                <h2>Manage <span className="highlight">Blog</span></h2>

                <div className="header-actions">
                    {/* Botón para volver al Dashboard principal */}
                    <button className="btn-secondary" onClick={() => navigate('/admin/dashboard')} style={{marginRight: '10px'}}>
                        &larr; Dashboard
                    </button>

                    {view === 'list' && (
                        <button className="btn-gold" onClick={() => setView('create')}>
                            + New Article
                        </button>
                    )}
                    {view !== 'list' && (
                        <button className="btn-secondary" onClick={() => setView('list')}>
                            Cancel / List
                        </button>
                    )}
                </div>
            </div>

            {view === 'list' ? (
                /* --- LIST VIEW --- */
                <div className="data-table-wrapper">
                    <table className="admin-table">
                        <thead>
                        <tr>
                            <th>Title</th>
                            <th>Category</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr>
                            <td>Global Granite Trends</td>
                            <td>Market</td>
                            <td><span className="status-badge published">Published</span></td>
                            <td>
                                <button className="action-btn" onClick={() => setView('edit')}>✏️</button>
                                <button className="action-btn">🗑️</button>
                            </td>
                        </tr>
                        </tbody>
                    </table>
                </div>
            ) : (
                /* --- FORM VIEW --- */
                <form onSubmit={handleSave} className="admin-form">

                    {/* LEFT COLUMN: CONTENT */}
                    <div className="form-section">
                        <h4>Article Content</h4>

                        <div className="form-group">
                            <label>Main Title</label>
                            <input type="text" name="title" value={formData.title} onChange={handleChange} required placeholder="Ex: The Evolution of Marble..." />
                        </div>

                        <div className="form-group">
                            <label>Slug (URL Friendly)</label>
                            <input type="text" name="slug" value={formData.slug} onChange={handleChange} placeholder="ex: marble-evolution-2026" />
                        </div>

                        <div className="form-group">
                            <label>Excerpt (Short Summary)</label>
                            <textarea name="excerpt" rows="3" value={formData.excerpt} onChange={handleChange} placeholder="Short description for the card..." />
                        </div>

                        <div className="form-group">
                            <label>Full Content (HTML or Text)</label>
                            {/* Content Image Upload Helper */}
                            <div style={{marginBottom: '10px', padding: '10px', background: '#222', borderRadius: '4px'}}>
                                <label style={{display:'inline-block', marginRight:'10px', fontSize:'0.8rem'}}>Insert image into text:</label>
                                <input type="file" onChange={handleContentImageUpload} className="btn-upload" accept="image/*" />
                            </div>

                            <textarea
                                name="content"
                                rows="15"
                                value={formData.content}
                                onChange={handleChange}
                                placeholder="Write the article content here. You can use basic HTML tags..."
                            ></textarea>
                        </div>
                    </div>

                    {/* RIGHT COLUMN: META & MEDIA */}
                    <div className="side-column">
                        <div className="form-section">
                            <h4>Classification & Media</h4>

                            <div className="form-group">
                                <label>Category</label>
                                <select className="admin-select" value={isCustomCategory ? 'NEW_CUSTOM' : formData.category} onChange={handleCategoryChange}>
                                    <option value="">Select...</option>
                                    {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                                    <option value="NEW_CUSTOM">+ Add New...</option>
                                </select>

                                {isCustomCategory && (
                                    <input
                                        type="text"
                                        name="newCategory"
                                        placeholder="New Category Name"
                                        value={formData.newCategory}
                                        onChange={handleChange}
                                        style={{marginTop: '10px', borderColor: '#d4af37'}}
                                        autoFocus
                                    />
                                )}
                            </div>

                            <div className="form-group">
                                <label>Cover Image</label>
                                <input type="file" onChange={handleCoverImageChange} accept="image/*" className="btn-upload" style={{width: '100%'}} />
                                {coverPreview && (
                                    <img src={coverPreview} alt="Preview" className="preview-img" />
                                )}
                                {!coverPreview && <div className="helper-text">No image selected</div>}
                            </div>
                        </div>

                        <div className="form-section" style={{marginTop: '30px'}}>
                            <h4>SEO (Google)</h4>
                            <div className="form-group">
                                <label>Meta Title</label>
                                <input type="text" name="metaTitle" value={formData.metaTitle} onChange={handleChange} maxLength="60" />
                            </div>
                            <div className="form-group">
                                <label>Meta Description</label>
                                <textarea name="metaDesc" rows="4" value={formData.metaDesc} onChange={handleChange} maxLength="160"></textarea>
                            </div>

                            <button type="submit" className="btn-gold" style={{width: '100%', marginTop: '20px'}}>
                                SAVE ARTICLE
                            </button>
                        </div>
                    </div>

                </form>
            )}
        </div>
    );
};

export default ManageBlog;