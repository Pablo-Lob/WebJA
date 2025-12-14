import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './styles/ManageCatalog.css'; // Reutilizamos el CSS del catálogo

const ManageBranches = () => {
    const navigate = useNavigate();
    const [branches, setBranches] = useState([]);
    const [loading, setLoading] = useState(false);

    // Formulario
    const [newBranch, setNewBranch] = useState({
        city: '',
        description: '',
        details: ''
    });
    const [imageFile, setImageFile] = useState(null);

    // --- CORRECCIÓN AQUÍ: Usamos api.php ---
    const API_URL = 'https://itsstonesfzco.com/api.php?table=branches';

    // 1. Cargar Branches (Con truco anti-caché)
    const fetchBranches = async () => {
        try {
            const response = await fetch(`${API_URL}&t=${Date.now()}`);
            if (!response.ok) throw new Error("Error del servidor: " + response.status);

            const data = await response.json();
            setBranches(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error("Error cargando sedes:", error);
        }
    };

    useEffect(() => {
        fetchBranches();
    }, []);

    // 2. Subir Branch
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const formData = new FormData();
            formData.append('city', newBranch.city);
            formData.append('description', newBranch.description);
            formData.append('details', newBranch.details);
            if (imageFile) {
                formData.append('image', imageFile);
            }

            // Nota: Al usar FormData no hace falta poner Content-Type manualmente
            const response = await fetch(API_URL, {
                method: 'POST',
                body: formData
            });

            const result = await response.json();

            if (result.status === 'success') {
                alert("Sede guardada correctamente");
                // Limpiar formulario
                setNewBranch({ city: '', description: '', details: '' });
                setImageFile(null);
                document.getElementById('file-upload').value = "";
                // Recargar lista
                fetchBranches();
            } else {
                alert("Error del servidor: " + (result.error || "Desconocido"));
            }
        } catch (error) {
            console.error("Error al subir:", error);
            alert("Error de conexión o fallo en api.php");
        } finally {
            setLoading(false);
        }
    };

    // 3. Borrar Branch
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
                <button onClick={() => navigate('/admin/dashboard')} className="back-btn-simple" style={{background:'none', border:'1px solid #666', color:'white', padding:'5px 15px', cursor:'pointer', borderRadius:'4px'}}>
                    ← Volver
                </button>
                <h1 style={{marginLeft:'20px'}}>Gestor de Sedes</h1>
            </div>

            <div className="admin-grid">
                {/* Formulario */}
                <div className="upload-section">
                    <h2>Añadir Nueva Sede</h2>
                    <form onSubmit={handleSubmit}>
                        <input
                            type="text"
                            placeholder="Ciudad / Título (Ej: DUBAI)"
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
                            <label style={{display:'block', marginBottom:'5px', color:'#aaa'}}>Imagen:</label>
                            <input
                                id="file-upload"
                                type="file"
                                accept="image/*"
                                onChange={e => setImageFile(e.target.files[0])}
                                className="file-input"
                            />
                        </div>

                        <button type="submit" className="save-btn" disabled={loading}>
                            {loading ? 'Guardando...' : 'Publicar Sede'}
                        </button>
                    </form>
                </div>

                {/* Lista */}
                <div className="list-section">
                    <h2>Sedes Activas</h2>
                    <div className="minerals-list">
                        {branches.length === 0 && <p style={{color:'#666'}}>No hay sedes creadas.</p>}

                        {branches.map(branch => (
                            <div key={branch.id} className="mineral-item-admin">
                                {branch.image ? (
                                    <img src={branch.image} alt={branch.city} onError={(e)=>{e.target.style.display='none'}} />
                                ) : (
                                    <div style={{width:'60px', height:'60px', background:'#333', borderRadius:'4px'}}></div>
                                )}
                                <div className="mineral-info">
                                    <h3>{branch.city}</h3>
                                    <p style={{fontSize:'0.8rem', color:'#aaa', margin:0}}>{branch.details}</p>
                                </div>
                                <button onClick={() => handleDelete(branch.id)} className="delete-btn">Eliminar</button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ManageBranches;