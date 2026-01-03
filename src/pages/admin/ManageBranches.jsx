import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Save, ArrowLeft } from 'lucide-react';
import './styles/ManageCatalog.css';

const ManageBranches = () => {
    const navigate = useNavigate();

    // --- ESTADO 1: Configuración (Títulos de la Sección) ---
    // Estos datos van a la tabla 'siteConfig'
    const [titles, setTitles] = useState({
        title: '',
        subtitle: ''
    });
    const [loadingTitles, setLoadingTitles] = useState(false);

    // --- ESTADO 2: Lista de Sedes (Items individuales) ---
    // Estos datos van a la tabla 'branches'
    const [branches, setBranches] = useState([]);
    const [loadingBranches, setLoadingBranches] = useState(false);

    // Estado para formulario de nueva/editar sede
    const [editingId, setEditingId] = useState(null);
    const [newBranch, setNewBranch] = useState({ city: '', description: '', details: '' });
    const [imageFile, setImageFile] = useState(null);

    // APIs
    const API_CONFIG = 'https://itsstonesfzco.com/api.php?table=siteConfig';
    const API_BRANCHES = 'https://itsstonesfzco.com/api.php?table=branches';

    // 1. CARGA INICIAL
    useEffect(() => {
        // Cargar Títulos
        const fetchConfig = async () => {
            try {
                const res = await fetch(`${API_CONFIG}&t=${Date.now()}`);
                const data = await res.json();
                if (Array.isArray(data)) {
                    const t = data.find(i => i.key === 'branches_title');
                    const s = data.find(i => i.key === 'branches_subtitle');
                    setTitles({
                        title: t ? t.value : '',
                        subtitle: s ? s.value : ''
                    });
                }
            } catch (e) { console.error(e); }
        };

        // Cargar Lista de Sedes
        const fetchBranches = async () => {
            try {
                const res = await fetch(`${API_BRANCHES}&t=${Date.now()}`);
                const data = await res.json();
                setBranches(Array.isArray(data) ? data : []);
            } catch (e) { console.error(e); }
        };

        fetchConfig();
        fetchBranches();
    }, []);

    // 2. GUARDAR TÍTULOS
    const handleSaveTitles = async (e) => {
        e.preventDefault();
        setLoadingTitles(true);
        try {
            // Preparamos el array como lo espera siteConfig
            const dataToSend = [
                { key: 'branches_title', value: titles.title },
                { key: 'branches_subtitle', value: titles.subtitle }
            ];

            const res = await fetch(API_CONFIG, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(dataToSend)
            });

            const result = await res.json();
            if (result.status === 'success') alert("Section headers updated!");
            else alert("Error saving headers");

        } catch (error) {
            alert("Connection error");
        } finally {
            setLoadingTitles(false);
        }
    };

    // 3. Gestión de branches
    const handleEditBranch = (branch) => {
        setEditingId(branch.id);
        setNewBranch({
            city: branch.city,
            description: branch.description,
            details: branch.details
        });
        // Scroll al formulario de edición (no al top de la página)
        document.getElementById('branch-form').scrollIntoView({ behavior: 'smooth' });
    };

    const cancelEdit = () => {
        setEditingId(null);
        setNewBranch({ city: '', description: '', details: '' });
        setImageFile(null);
        document.getElementById('file-upload').value = "";
    };

    const handleSaveBranch = async (e) => {
        e.preventDefault();
        setLoadingBranches(true);
        try {
            const formData = new FormData();
            if (editingId) formData.append('id', editingId);
            formData.append('city', newBranch.city);
            formData.append('description', newBranch.description);
            formData.append('details', newBranch.details);
            if (imageFile) formData.append('image', imageFile);

            const res = await fetch(API_BRANCHES, { method: 'POST', body: formData });
            const result = await res.json();

            if (result.status === 'success') {
                alert(editingId ? "Location updated" : "Location added");
                cancelEdit();
                // Recargar lista
                const resList = await fetch(`${API_BRANCHES}&t=${Date.now()}`);
                const dataList = await resList.json();
                setBranches(Array.isArray(dataList) ? dataList : []);
            } else {
                alert("Error: " + result.error);
            }
        } catch (error) {
            alert("Connection error");
        } finally {
            setLoadingBranches(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Delete this location?")) {
            await fetch(`${API_BRANCHES}&id=${id}`, { method: 'DELETE' });
            // Recargar rápido
            const res = await fetch(`${API_BRANCHES}&t=${Date.now()}`);
            const data = await res.json();
            setBranches(data);
        }
    };

    return (
        <div className="manage-catalog-container">
            <div className="catalog-header">
                <button onClick={() => navigate('/admin/dashboard/landing-page')} className="back-btn-simple">
                    <ArrowLeft size={18} style={{marginRight:'5px'}}/> Back to Landing
                </button>
                <h1>Branches Manager</h1>
            </div>

            {/* --- SECCIÓN A: CONFIGURACIÓN GLOBAL (Títulos) --- */}
            <div className="admin-grid" style={{marginBottom:'30px'}}>
                <div className="upload-section" style={{borderLeft:'4px solid #f1c40f'}}>
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
                                placeholder="Ex: Our Global Presence"
                            />
                        </div>
                        <div className="form-group">
                            <label style={{fontWeight:'bold'}}>Subtitle</label>
                            <input
                                type="text"
                                className="admin-input"
                                value={titles.subtitle}
                                onChange={e => setTitles({...titles, subtitle: e.target.value})}
                                placeholder="Ex: Strategically located..."
                            />
                        </div>

                        <button type="submit" className="save-btn" disabled={loadingTitles}>
                            <Save size={18} style={{marginRight:'5px'}}/>
                            {loadingTitles ? 'Saving...' : 'Update Headers'}
                        </button>
                    </form>
                </div>

                {/* Panel informativo lateral (Opcional) */}
                <div className="list-section" style={{display:'flex', alignItems:'center', justifyContent:'center', color:'#aaa', fontStyle:'italic'}}>
                    <p>Use this top section to control the text that appears above the map/list on the main page.</p>
                </div>
            </div>

            <hr className="divider" style={{margin:'0 0 30px 0', border:'0', borderTop:'1px solid #444'}}/>

            {/* --- SECCIÓN B: LISTADO DE SEDES (CRUD) --- */}
            <div className="admin-grid" id="branch-form">
                {/* Formulario Nueva Sede */}
                <div className="upload-section">
                    <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
                        <h2>{editingId ? 'Edit Location': 'Add New Location'}</h2>
                        {editingId && (
                            <button onClick={cancelEdit} className="cancel-btn">Cancel</button>
                        )}
                    </div>

                    <form onSubmit={handleSaveBranch}>
                        <input
                            type="text"
                            placeholder="City (Ex: DUBAI)"
                            className="admin-input"
                            value={newBranch.city}
                            onChange={e => setNewBranch({...newBranch, city: e.target.value})}
                            required
                        />
                        <textarea
                            placeholder="Description..."
                            className="admin-textarea"
                            value={newBranch.description}
                            onChange={e => setNewBranch({...newBranch, description: e.target.value})}
                            required
                        />
                        <input
                            type="text"
                            placeholder="Details (Address, Phone...)"
                            className="admin-input"
                            value={newBranch.details}
                            onChange={e => setNewBranch({...newBranch, details: e.target.value})}
                            required
                        />

                        <div className="file-input-wrapper">
                            <label style={{display:'block', marginBottom:'5px', color:'#aaa'}}>
                                {editingId ? 'Change Image:' : 'Location Image:'}
                            </label>
                            <input
                                id="file-upload"
                                type="file"
                                accept="image/*"
                                onChange={e => setImageFile(e.target.files[0])}
                                className="file-input"
                            />
                        </div>

                        <button type="submit" className="save-btn" disabled={loadingBranches}>
                            {loadingBranches ? 'Saving...' : (editingId ? 'Update Location': 'Add Location')}
                        </button>
                    </form>
                </div>

                {/* Lista Visual */}
                <div className="list-section">
                    <h2>Active Locations ({branches.length})</h2>
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
                                    <button onClick={() => handleEditBranch(branch)} className="edit-btn">Edit</button>
                                    <button onClick={() => handleDelete(branch.id)} className="delete-btn">Delete</button>
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