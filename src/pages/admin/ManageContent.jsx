import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './styles/ManageCatalog.css';

const ManageCatalog = () => {
    const navigate = useNavigate();
    const [minerals, setMinerals] = useState([]);
    const [loading, setLoading] = useState(false);

    // Estado del formulario
    const [newItem, setNewItem] = useState({ name: '', description: '' });
    const [imageFiles, setImageFiles] = useState([]);

    // IMPORTANTE: Esta URL debe apuntar a donde estará tu archivo PHP cuando subas la web
    // Si estás en local (npm run dev), esto intentará buscar el PHP en localhost:5173, lo cual fallará
    // a menos que ya hayas subido el backend a Hostinger.
    // RECOMIENDO: Usa la URL real de tu dominio para las pruebas si ya subiste el PHP.
    const API_URL = 'https://itsstonesfzco.com/catalog-api.php';

    // 1. Cargar minerales desde MySQL (vía PHP)
    const fetchMinerals = async () => {
        try {
            const response = await fetch(API_URL);
            if (!response.ok) throw new Error("Error al conectar con el servidor");
            const data = await response.json();
            setMinerals(Array.isArray(data) ? data : []); // Asegurar que sea array
        } catch (error) {
            console.error("Error cargando catálogo:", error);
        }
    };

    useEffect(() => {
        fetchMinerals();
    }, []);

    const handleImageChange = (e) => {
        if (e.target.files) {
            setImageFiles(Array.from(e.target.files));
        }
    };

    // 2. Subir mineral (POST a PHP)
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const formData = new FormData();
            formData.append('name', newItem.name);
            formData.append('description', newItem.description);

            // Añadir todas las imágenes al FormData
            imageFiles.forEach((file) => {
                formData.append('images[]', file);
            });

            const response = await fetch(API_URL, {
                method: 'POST',
                body: formData // Fetch detecta FormData y pone el Content-Type correcto automáticamente
            });

            const result = await response.json();

            if (result.status === 'success') {
                alert("Mineral añadido correctamente");
                setNewItem({ name: '', description: '' });
                setImageFiles([]);
                // Limpiar visualmente el input file (truco rápido)
                document.getElementById('file-upload').value = "";
                fetchMinerals(); // Recargar lista
            } else {
                alert("Error del servidor: " + (result.error || "Desconocido"));
            }
        } catch (error) {
            console.error("Error:", error);
            alert("Error de conexión. Asegúrate de haber subido catalog-api.php a Hostinger.");
        } finally {
            setLoading(false);
        }
    };

    // 3. Borrar mineral (DELETE a PHP)
    const handleDelete = async (id) => {
        if (window.confirm("¿Seguro que quieres eliminar este mineral?")) {
            try {
                // Enviamos el ID por parámetro URL
                const response = await fetch(`${API_URL}?id=${id}`, {
                    method: 'DELETE',
                });
                const result = await response.json();

                if (result.status === 'deleted') {
                    fetchMinerals(); // Recargar lista
                } else {
                    alert("Error al eliminar: " + result.error);
                }
            } catch (error) {
                console.error("Error borrando:", error);
                alert("Error de conexión al borrar.");
            }
        }
    };

    return (
        <div className="manage-catalog-container">
            <div className="catalog-header">
                <button onClick={() => navigate('/admin/dashboard')} className="back-btn-simple" style={{background:'none', border:'1px solid #666', color:'white', padding:'5px 15px', cursor:'pointer', borderRadius:'4px'}}>
                    ← Volver al Panel
                </button>
                <h1 style={{marginLeft:'20px'}}>Gestor de Catálogo</h1>
            </div>

            <div className="admin-grid">
                {/* Formulario */}
                <div className="upload-section">
                    <h2>Añadir Nuevo Mineral</h2>
                    <form onSubmit={handleSubmit}>
                        <input
                            type="text"
                            placeholder="Nombre del Mineral"
                            className="admin-input"
                            value={newItem.name}
                            onChange={e => setNewItem({...newItem, name: e.target.value})}
                            required
                        />
                        <textarea
                            placeholder="Descripción detallada..."
                            className="admin-textarea"
                            value={newItem.description}
                            onChange={e => setNewItem({...newItem, description: e.target.value})}
                            required
                        />

                        <div className="file-input-wrapper">
                            <label style={{display:'block', marginBottom:'5px', color:'#aaa'}}>Imágenes (puedes seleccionar varias):</label>
                            <input
                                id="file-upload"
                                type="file"
                                multiple
                                accept="image/*"
                                onChange={handleImageChange}
                                className="file-input"
                                required
                            />
                        </div>

                        {/* Previsualización nombres de archivos */}
                        <div className="files-preview">
                            {imageFiles.map((f, i) => (
                                <span key={i} className="file-tag">{f.name}</span>
                            ))}
                        </div>

                        <button type="submit" className="save-btn" disabled={loading}>
                            {loading ? 'Subiendo datos e imágenes...' : 'Publicar en Catálogo'}
                        </button>
                    </form>
                </div>

                {/* Lista */}
                <div className="list-section">
                    <h2>Inventario Actual</h2>
                    <div className="minerals-list">
                        {minerals.length === 0 && <p style={{color:'#666'}}>No hay minerales aún.</p>}

                        {minerals.map(mineral => (
                            <div key={mineral.id} className="mineral-item-admin">
                                {/* Mostramos la primera imagen si existe */}
                                {mineral.images && mineral.images[0] ? (
                                    <img src={mineral.images[0]} alt={mineral.name} />
                                ) : (
                                    <div style={{width:'60px', height:'60px', background:'#333', borderRadius:'4px'}}></div>
                                )}

                                <div className="mineral-info">
                                    <h3>{mineral.name}</h3>
                                    <small style={{color:'#888'}}>
                                        {mineral.images ? mineral.images.length : 0} imágenes
                                    </small>
                                </div>
                                <button onClick={() => handleDelete(mineral.id)} className="delete-btn">Eliminar</button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ManageCatalog;