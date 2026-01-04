import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Save, Trash2, Shield, ArrowLeft } from 'lucide-react'; // Asegúrate de tener iconos o quítalos si no usas lucide
import './ManageCatalog.css'

const ManageAdmins = () => {
    const navigate = useNavigate();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);

    // Estado para nuevo usuario
    // IMPORTANTE: El rol por defecto debe ser uno válido en tu BD ('editor' o 'superadmin')
    const [newUser, setNewUser] = useState({
        email: '',
        password: '',
        role: 'editor'
    });

    const API_URL = 'https://itsstonesfzco.com/api.php?table=admin_users';

    // 1. Cargar Usuarios
    const fetchUsers = async () => {
        try {
            const res = await fetch(`${API_URL}&t=${Date.now()}`);
            const data = await res.json();
            setUsers(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error("Error loading users:", error);
        }
    };

    useEffect(() => { fetchUsers(); }, []);

    // 2. Crear Usuario
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const formData = new FormData();
            formData.append('action', 'create');
            formData.append('email', newUser.email);
            formData.append('password', newUser.password);

            // Aquí aseguramos que se envíe el rol seleccionado
            formData.append('role', newUser.role);

            const res = await fetch(API_URL, {
                method: 'POST',
                body: formData
            });
            const result = await res.json();

            if (result.status === 'success') {
                alert('User created successfully');
                setNewUser({ email: '', password: '', role: 'editor' }); // Reset form
                fetchUsers(); // Recargar lista
            } else {
                alert('Error: ' + (result.error || 'Email might be duplicated'));
            }
        } catch (error) {
            alert('Connection Error');
        } finally {
            setLoading(false);
        }
    };

    // 3. Eliminar Usuario
    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to remove this admin?")) {
            await fetch(`${API_URL}&id=${id}`, { method: 'DELETE' });
            fetchUsers();
        }
    };

    return (
        <div className="manage-catalog-container">
            <div className="catalog-header">
                <button onClick={() => navigate('/admin/dashboard')} className="back-btn-simple">
                    <ArrowLeft size={18} /> Return
                </button>
                <h1>Admin Users Manager</h1>
            </div>

            <div className="admin-grid">
                {/* Formulario de Creación */}
                <div className="upload-section">
                    <h2>Create New Admin</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label>Email Address</label>
                            <input
                                type="email"
                                placeholder="name@itsstones.com"
                                className="admin-input"
                                value={newUser.email}
                                onChange={e => setNewUser({...newUser, email: e.target.value})}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Password</label>
                            <input
                                type="password"
                                placeholder="Set initial password"
                                className="admin-input"
                                value={newUser.password}
                                onChange={e => setNewUser({...newUser, password: e.target.value})}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Role / Permissions</label>
                            <select
                                className="admin-input"
                                value={newUser.role}
                                onChange={e => setNewUser({...newUser, role: e.target.value})}
                            >
                                {/* CORRECCIÓN CRÍTICA: Value debe ser 'superadmin' si tu DB usa ese ENUM */}
                                <option value="superadmin">Super Admin (Full Access)</option>
                                <option value="editor">Editor (Content Only)</option>
                            </select>
                        </div>

                        <button type="submit" className="save-btn" disabled={loading}>
                            {loading ? 'Creating...' : 'Create Admin User'}
                        </button>
                    </form>
                </div>

                {/* Lista de Usuarios */}
                <div className="list-section">
                    <h2>Active Admins ({users.length})</h2>
                    <div className="minerals-list">
                        {users.map(u => (
                            <div key={u.id} className="mineral-item-admin" style={{justifyContent:'space-between', padding:'15px', alignItems:'center'}}>
                                <div style={{display:'flex', alignItems:'center', gap:'15px'}}>
                                    <div style={{background:'#f0f0f0', padding:'10px', borderRadius:'50%'}}>
                                        <Shield size={24} color="#555"/>
                                    </div>
                                    <div>
                                        <h3 style={{margin:0, fontSize:'1.1rem'}}>{u.email}</h3>
                                        <span style={{
                                        }}>
                                            {u.role ? u.role.toUpperCase() : 'UNKNOWN'}
                                        </span>
                                    </div>
                                </div>
                                <button onClick={() => handleDelete(u.id)} className="delete-btn" style={{padding:'8px'}}>
                                    <Trash2 size={18}/>
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ManageAdmins;