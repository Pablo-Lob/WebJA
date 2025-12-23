import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './styles/ManageCatalog.css'; // Reutilizamos CSS

const ManageServices = () => {
    const navigate = useNavigate();
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(false);
    const [editingId, setEditingId] = useState(null);

    // Campos específicos de Services: Title y Description
    const [newService, setNewService] = useState({
        title: '',
        description: ''
    });
    const [imageFile, setImageFile] = useState(null);

    const API_URL = 'https://itsstonesfzco.com/api.php?table=services';

    const fetchServices = async () => {
        try {
            const response = await fetch(`${API_URL}&t=${Date.now()}`);
            if (!response.ok) throw new Error("Error API");
            const data = await response.json();
            setServices(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error("Error cargando servicios:", error);
        }
    };

    useEffect(() => {
        fetchServices();
    }, []);

    const handleEdit = (service) => {
        setEditingId(service.id);
        setNewService({
            title: service.title,
            description: service.description
        });
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const cancelEdit = () => {
        setEditingId(null);
        setNewService({ title: '', description: '' });
        setImageFile(null);
        document.getElementById('file-upload').value = "";
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const formData = new FormData();
            if (editingId) formData.append('id', editingId);

            formData.append('title', newService.title);
            formData.append('description', newService.description);

            if (imageFile) formData.append('image', imageFile);

            const response = await fetch(API_URL, {
                method: 'POST',
                body: formData
            });

            const result = await response.json();

            if (result.status === 'success') {
                alert(editingId ? "Servicio actualizado" : "Servicio creado");
                cancelEdit();
                fetchServices();
            } else {
                alert("Error: " + (result.error || "Desconocido"));
            }
        } catch (error) {
            console.error(error);
            alert("Error de conexión");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("¿Eliminar este servicio?")) {
            try {
                await fetch(`${API_URL}&id=${id}`, { method: 'DELETE' });
                fetchServices();
            } catch (error) { console.error(error); }
        }
    };

    return (
        <div className="manage-catalog-container">
            <div className="catalog-header">
                <button onClick={() => navigate('/admin/dashboard')} className="back-btn-simple">
                    ← Volver
                </button>
                <h1>Gestor de Servicios</h1>
            </div>

            <div className="admin-grid">
                <div className="upload-section">
                    <div style={{display:'flex', justifyContent:'space-between'}}>
                        <h2>{editingId ? 'Editar Servicio' : 'Añadir Servicio'}</h2>
                        {editingId && <button onClick={cancelEdit} className="cancel-btn">Cancelar</button>}
                    </div>

                    <form onSubmit={handleSubmit}>
                        <input
                            type="text"
                            placeholder="Título del Servicio"
                            className="admin-input"
                            value={newService.title}
                            onChange={e => setNewService({...newService, title: e.target.value})}
                            required
                        />
                        <textarea
                            placeholder="Descripción del servicio..."
                            className="admin-textarea"
                            value={newService.description}
                            onChange={e => setNewService({...newService, description: e.target.value})}
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
                            {loading ? 'Guardando...' : (editingId ? 'Actualizar' : 'Publicar')}
                        </button>
                    </form>
                </div>

                <div className="list-section">
                    <h2>Servicios Activos</h2>
                    <div className="minerals-list">
                        {services.map(service => (
                            <div key={service.id} className="mineral-item-admin">
                                {service.image ? (
                                    <img src={service.image} alt={service.title} onError={(e)=>e.target.style.display='none'} />
                                ) : (
                                    <div className="placeholder-img"></div>
                                )}
                                <div className="mineral-info">
                                    <h3>{service.title}</h3>
                                    <p className="small-text">{service.description.substring(0, 50)}...</p>
                                </div>
                                <div className="actions">
                                    <button onClick={() => handleEdit(service)} className="edit-btn">Editar</button>
                                    <button onClick={() => handleDelete(service.id)} className="delete-btn">Eliminar</button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ManageServices;