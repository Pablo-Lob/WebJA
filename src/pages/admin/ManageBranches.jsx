import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './styles/ManageCatalog.css';

const ManageBranches = () => {
    const navigate = useNavigate();
    const [branches, setBranches] = useState([]);
    const [loading, setLoading] = useState(false);

    // Estado para Edición
    const [editingId, setEditingId] = useState(null); // Si es null, estamos creando. Si tiene ID, editamos.

    const [newBranch, setNewBranch] = useState({
        city: '',
        description: '',
        details: ''
    });
    const [imageFile, setImageFile] = useState(null);

    const API_URL = 'https://itsstonesfzco.com/api.php?table=branches';

    // 1. Cargar
    const fetchBranches = async () => {
        try {
            const response = await fetch(`${API_URL}&t=${Date.now()}`);
            if (!response.ok) throw new Error("Error del servidor");
            const data = await response.json();
            setBranches(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error("Error cargando sedes:", error);
        }
    };

    useEffect(() => {
        fetchBranches();
    }, []);

    // 2. Preparar Edición
    const handleEdit = (branch) => {
        setEditingId(branch.id);
        setNewBranch({
            city: branch.city,
            description: branch.description,
            details: branch.details
        });
        // Scroll suave hacia el formulario
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // 3. Cancelar Edición
    const cancelEdit = () => {
        setEditingId(null);
        setNewBranch({ city: '', description: '', details: '' });
        setImageFile(null);
        document.getElementById('file-upload').value = "";
    };

    // 4. Submit (Crear o Editar)
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const formData = new FormData();
            // Si estamos editando, mandamos el ID
            if (editingId) {
                formData.append('id', editingId);
            }

            formData.append('city', newBranch.city);
            formData.append('description', newBranch.description);
            formData.append('details', newBranch.details);

            if (imageFile) {
                formData.append('image', imageFile);
            }

            const response = await fetch(API_URL, {
                method: 'POST',
                body: formData
            });

            const result = await response.json();

            if (result.status === 'success') {
                alert(editingId ? "Sede actualizada" : "Sede creada");
                cancelEdit(); // Limpiar todo
                fetchBranches(); // Recargar lista
            } else {
                alert("Error: " + (result.error || "Desconocido"));
            }
        } catch (error) {
            console.error("Error al subir:", error);
            alert("Error de conexión");
        } finally {
            setLoading(false);
        }
    };

    // 5. Borrar
    const handleDelete = async (id) => {
        if (window.confirm("¿Seguro que quieres borrar esta sede?")) {
            try {
                await fetch(`${API_URL}&id=${id}`, { method: 'DELETE' });
                fetchBranches();
            } catch (error) {
                console.error("Error borrando:", error);
            }
        }
    };

    return (
        <div className="manage-catalog-container">
            <div className="catalog-header">
                <button onClick={() => navigate('/admin/dashboard')} className="back-btn-simple">
                    ← Volver
                </button>
                <h1>Gestor de Sedes</h1>
            </div>

            <div className="admin-grid">
                {/* Formulario */}
                <div className="upload-section">
                    <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
                        <h2>{editingId ? 'Editar Sede' : 'Añadir Nueva Sede'}</h2>
                        {editingId && (
                            <button onClick={cancelEdit} style={{background:'#e74c3c', color:'white', border:'none', padding:'5px 10px', borderRadius:'4px', cursor:'pointer'}}>
                                Cancelar Edición
                            </button>
                        )}
                    </div>

                    <form onSubmit={handleSubmit}>
                        <input
                            type="text"
                            placeholder="Ciudad (Ej: DUBAI)"
                            className="admin-input"
                            value={newBranch.city}
                            onChange={e => setNewBranch({...newBranch, city: e.target.value})}
                            required
                        />
                        <textarea
                            placeholder="Descripción..."
                            className="admin-textarea"
                            value={newBranch.description}
                            onChange={e => setNewBranch({...newBranch, description: e.target.value})}
                            required
                        />
                        <input
                            type="text"
                            placeholder="Detalles (Dirección...)"
                            className="admin-input"
                            value={newBranch.details}
                            onChange={e => setNewBranch({...newBranch, details: e.target.value})}
                            required
                        />

                        <div className="file-input-wrapper">
                            <label style={{display:'block', marginBottom:'5px', color:'#aaa'}}>
                                {editingId ? 'Cambiar Imagen (Opcional):' : 'Imagen:'}
                            </label>
                            <input
                                id="file-upload"
                                type="file"
                                accept="image/*"
                                onChange={e => setImageFile(e.target.files[0])}
                                className="file-input"
                            />
                        </div>

                        <button type="submit" className="save-btn" disabled={loading}>
                            {loading ? 'Guardando...' : (editingId ? 'Actualizar Sede' : 'Publicar Sede')}
                        </button>
                    </form>
                </div>

                {/* Lista */}
                <div className="list-section">
                    <h2>Sedes Activas</h2>
                    <div className="minerals-list">
                        {branches.map(branch => (
                            <div key={branch.id} className="mineral-item-admin">
                                {branch.image ? (
                                    <img src={branch.image} alt={branch.city} onError={(e)=>{e.target.style.display='none'}} />
                                ) : (
                                    <div className="placeholder-img"></div>
                                )}
                                <div className="mineral-info">
                                    <h3>{branch.city}</h3>
                                    <p className="small-text">{branch.details}</p>
                                </div>
                                <div className="actions">
                                    <button onClick={() => handleEdit(branch)} className="edit-btn">Editar</button>
                                    <button onClick={() => handleDelete(branch.id)} className="delete-btn">Eliminar</button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ManageBranches;