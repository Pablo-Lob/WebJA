import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Save, ArrowLeft } from 'lucide-react';
import './ManageCatalog.css';

const ManageServices = () => {
    const navigate = useNavigate();

    // --- ESTADO 1: Configuración (Títulos de la Sección) ---
    const [titles, setTitles] = useState({
        title: '',
        subtitle: ''
    });
    const [loadingTitles, setLoadingTitles] = useState(false);

    // --- ESTADO 2: Lista de Servicios (Items) ---
    const [services, setServices] = useState([]);
    const [loadingServices, setLoadingServices] = useState(false);

    // Estado para edición
    const [editingId, setEditingId] = useState(null);
    const [newService, setNewService] = useState({ title: '', description: '' });
    const [imageFile, setImageFile] = useState(null);

    // APIs
    const API_CONFIG = 'https://itsstonesfzco.com/api.php?table=siteConfig';
    const API_SERVICES = 'https://itsstonesfzco.com/api.php?table=services';

    // 1. CARGA INICIAL
    useEffect(() => {
        // Cargar Títulos
        const fetchConfig = async () => {
            try {
                const res = await fetch(`${API_CONFIG}&t=${Date.now()}`);
                const data = await res.json();
                if (Array.isArray(data)) {
                    const t = data.find(i => i.key === 'services_title');
                    const s = data.find(i => i.key === 'services_subtitle');
                    setTitles({
                        title: t ? t.value : '',
                        subtitle: s ? s.value : ''
                    });
                }
            } catch (e) { console.error(e); }
        };

        // Cargar Lista
        fetchServicesList();
        fetchConfig();
    }, []);

    const fetchServicesList = async () => {
        try {
            const res = await fetch(`${API_SERVICES}&t=${Date.now()}`);
            const data = await res.json();
            setServices(Array.isArray(data) ? data : []);
        } catch (e) { console.error(e); }
    };

    // 2. GUARDAR TÍTULOS
    const handleSaveTitles = async (e) => {
        e.preventDefault();
        setLoadingTitles(true);
        try {
            const dataToSend = [
                { key: 'services_title', value: titles.title },
                { key: 'services_subtitle', value: titles.subtitle }
            ];
            const res = await fetch(API_CONFIG, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(dataToSend)
            });
            const result = await res.json();
            if (result.status === 'success') alert("Section headers updated!");
            else alert("Error saving headers");
        } catch (error) { alert("Connection error"); }
        finally { setLoadingTitles(false); }
    };

    // 3. GESTIÓN DE LA LISTA (CRUD)
    const handleEditService = (service) => {
        setEditingId(service.id);
        setNewService({
            title: service.title,
            description: service.description
        });
        document.getElementById('service-form').scrollIntoView({ behavior: 'smooth' });
    };

    const cancelEdit = () => {
        setEditingId(null);
        setNewService({ title: '', description: '' });
        setImageFile(null);
        document.getElementById('file-upload').value = "";
    };

    const handleSaveService = async (e) => {
        e.preventDefault();
        setLoadingServices(true);
        try {
            const formData = new FormData();
            if (editingId) formData.append('id', editingId);
            formData.append('title', newService.title);
            formData.append('description', newService.description);
            if (imageFile) formData.append('image', imageFile);

            const res = await fetch(API_SERVICES, { method: 'POST', body: formData });
            const result = await res.json();

            if (result.status === 'success') {
                alert(editingId ? "Service updated" : "Service created");
                cancelEdit();
                fetchServicesList();
            } else {
                alert("Error: " + result.error);
            }
        } catch (error) { alert("Connection error"); }
        finally { setLoadingServices(false); }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Delete this service?")) {
            await fetch(`${API_SERVICES}&id=${id}`, { method: 'DELETE' });
            fetchServicesList();
        }
    };

    return (
        <div className="manage-catalog-container">
            <div className="catalog-header">
                <button onClick={() => navigate('/admin/dashboard/landing-page')} className="back-btn-simple">
                    <ArrowLeft size={18} style={{marginRight:'5px'}}/> Back to Landing
                </button>
                <h1>Services Manager</h1>
            </div>

            {/* --- SECCIÓN A: CONFIGURACIÓN GLOBAL (Títulos) --- */}
            <div className="admin-grid" style={{marginBottom:'30px'}}>
                <div className="upload-section" style={{borderLeft:'4px solid #3498db'}}>
                    <div style={{display:'flex', alignItems:'center', gap:'10px', marginBottom:'15px'}}>
                        <h2 style={{margin:0}}>Section Header</h2>
                        <span style={{fontSize:'0.8rem', color:'#aaa'}}>(Visible on Home Page)</span>
                    </div>

                    <form onSubmit={handleSaveTitles}>
                        <div className="form-group">
                            <label style={{fontWeight:'bold'}}>Main Title</label>
                            <input
                                type="text"
                                className="admin-input"
                                value={titles.title}
                                onChange={e => setTitles({...titles, title: e.target.value})}
                                placeholder="Ex: Our Exclusive Services"
                            />
                        </div>
                        <div className="form-group">
                            <label style={{fontWeight:'bold'}}>Subtitle</label>
                            <input
                                type="text"
                                className="admin-input"
                                value={titles.subtitle}
                                onChange={e => setTitles({...titles, subtitle: e.target.value})}
                                placeholder="Ex: Tailored solutions for..."
                            />
                        </div>

                        <button type="submit" className="save-btn" disabled={loadingTitles}>
                            <Save size={18} style={{marginRight:'5px'}}/>
                            {loadingTitles ? 'Saving...' : 'Update Headers'}
                        </button>
                    </form>
                </div>
            </div>

            <hr className="divider" style={{margin:'0 0 30px 0', border:'0', borderTop:'1px solid #444'}}/>

            {/* --- SECCIÓN B: LISTADO DE SERVICIOS (CRUD) --- */}
            <div className="admin-grid" id="service-form">
                <div className="upload-section">
                    <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
                        <h2>{editingId ? 'Edit Service': 'Add New Service'}</h2>
                        {editingId && <button onClick={cancelEdit} className="cancel-btn">Cancel</button>}
                    </div>

                    <form onSubmit={handleSaveService}>
                        <input
                            type="text"
                            placeholder="Service Title"
                            className="admin-input"
                            value={newService.title}
                            onChange={e => setNewService({...newService, title: e.target.value})}
                            required
                        />
                        <textarea
                            placeholder="Description..."
                            className="admin-textarea"
                            value={newService.description}
                            onChange={e => setNewService({...newService, description: e.target.value})}
                            required
                        />

                        <div className="file-input-wrapper">
                            <label style={{display:'block', marginBottom:'5px', color:'#aaa'}}>
                                {editingId ? 'Change Image:' : 'Service Image:'}
                            </label>
                            <input
                                id="file-upload"
                                type="file"
                                accept="image/*"
                                onChange={e => setImageFile(e.target.files[0])}
                                className="file-input"
                            />
                        </div>

                        <button type="submit" className="save-btn" disabled={loadingServices}>
                            {loadingServices ? 'Saving...' : (editingId ? 'Update Service': 'Add Service')}
                        </button>
                    </form>
                </div>

                <div className="list-section">
                    <h2>Active Services ({services.length})</h2>
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
                                    <button onClick={() => handleEditService(service)} className="edit-btn">Edit</button>
                                    <button onClick={() => handleDelete(service.id)} className="delete-btn">Delete</button>
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