import React, { useState } from 'react';
import './ManageBlog.css'; // Estilos específicos para la administración

const ManageBlog = () => {
    // Modo edición o lista
    const [view, setView] = useState('list'); // 'list' | 'create' | 'edit'

    const [formData, setFormData] = useState({
        title: '',
        slug: '',
        excerpt: '',
        content: '', // Aquí conectarías un Rich Text Editor si quisieras
        category: '',
        metaTitle: '', // Para SEO
        metaDesc: ''   // Para SEO
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSave = (e) => {
        e.preventDefault();
        console.log("Guardando en BD:", formData);
        alert("Artículo guardado (Mira la consola)");
        setView('list');
    };

    return (
        <div className="admin-blog-container">
            <div className="admin-header">
                <h2>Panel de Control / <span className="highlight">Blog</span></h2>
                {view === 'list' && (
                    <button className="btn-neon" onClick={() => setView('create')}>
                        + NUEVO ARTÍCULO
                    </button>
                )}
                {view !== 'list' && (
                    <button className="btn-ghost" onClick={() => setView('list')}>
                        ← VOLVER
                    </button>
                )}
            </div>

            {view === 'list' ? (
                /* --- VISTA LISTA --- */
                <div className="data-table-wrapper">
                    <table className="neon-table">
                        <thead>
                        <tr>
                            <th>Título</th>
                            <th>Slug</th>
                            <th>Estado</th>
                            <th>Acciones</th>
                        </tr>
                        </thead>
                        <tbody>
                        {/* Ejemplo estático */}
                        <tr>
                            <td>El Futuro de la IA</td>
                            <td>futuro-ia-2026</td>
                            <td><span className="status-badge published">Publicado</span></td>
                            <td>
                                <button className="action-btn edit" onClick={() => setView('edit')}>✏️</button>
                                <button className="action-btn delete">🗑️</button>
                            </td>
                        </tr>
                        </tbody>
                    </table>
                </div>
            ) : (
                /* --- VISTA FORMULARIO --- */
                <div className="editor-wrapper">
                    <form onSubmit={handleSave} className="admin-form">
                        <div className="form-section">
                            <h4>Contenido Principal</h4>
                            <div className="form-group">
                                <label>Título</label>
                                <input type="text" name="title" value={formData.title} onChange={handleChange} required />
                            </div>
                            <div className="form-group">
                                <label>Slug (URL)</label>
                                <input type="text" name="slug" value={formData.slug} onChange={handleChange} placeholder="ej: mi-nuevo-articulo" />
                            </div>
                            <div className="form-group">
                                <label>Categoría</label>
                                <select name="category" value={formData.category} onChange={handleChange} className="dark-select">
                                    <option value="">Selecciona...</option>
                                    <option value="Dev">Desarrollo</option>
                                    <option value="Security">Ciberseguridad</option>
                                    <option value="Innovation">Innovación</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Contenido</label>
                                <textarea name="content" rows="10" value={formData.content} onChange={handleChange}></textarea>
                            </div>
                        </div>

                        {/* SECCIÓN SEO CLAVE */}
                        <div className="form-section seo-box">
                            <h4>🚀 Configuración SEO</h4>
                            <p className="seo-help">Estos datos son los que Google mostrará en los resultados de búsqueda.</p>

                            <div className="form-group">
                                <label>Meta Title (Max 60 chars)</label>
                                <input type="text" name="metaTitle" maxLength="60" placeholder="Título atractivo para Google" value={formData.metaTitle} onChange={handleChange} />
                            </div>

                            <div className="form-group">
                                <label>Meta Description (Max 160 chars)</label>
                                <textarea name="metaDesc" rows="3" maxLength="160" placeholder="Resumen que incita al clic..." value={formData.metaDesc} onChange={handleChange}></textarea>
                            </div>
                        </div>

                        <div className="form-actions">
                            <button type="submit" className="btn-neon">GUARDAR CAMBIOS</button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
};

export default ManageBlog;