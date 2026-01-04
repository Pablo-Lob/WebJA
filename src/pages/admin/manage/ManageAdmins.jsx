import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Save, Trash2, Shield, ArrowLeft } from 'lucide-react';
import './ManageCatalog.css';

const ManageAdmins = () => {
    const navigate = useNavigate();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);

    // Estado para nuevo usuario
    const [newUser, setNewUser] = useState({
        email: '',
        password: '',
        role: 'editor'
    });

    const API_URL = 'https://itsstonesfzco.com/api.php?table=admin_users';

    // --- PROTECCIÓN DE RUTA ---
    useEffect(() => {
        const role = localStorage.getItem('adminRole');
        if (role !== 'superadmin') {
            alert("Acceso Denegado: Se requieren permisos de Super Admin.");
            navigate('/admin/dashboard'); // Expulsar al dashboard
        } else {
            // Solo cargamos usuarios si es superadmin
            fetchUsers();
        }
    }, [navigate]);

    // 1. Cargar Usuarios
    const fetchUsers = async () => {
        try {
            const res = await fetch(`${API_URL}&t=${Date.now()}`);
            const data = await res.json();
            setUsers(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error("Error cargando usuarios:", error);
        }
    };

    // 2. Crear Usuario
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const formData = new FormData();
            formData.append('action', 'create');
            formData.append('email', newUser.email);
            formData.append('password', newUser.password);
            formData.append('role', newUser.role); // 'superadmin' o 'editor'

            const res = await fetch(API_URL, {
                method: 'POST',
                body: formData
            });
            const result = await res.json();

            if (result.status === 'success') {
                alert('Usuario creado correctamente');
                setNewUser({ email: '', password: '', role: 'editor' });
                fetchUsers();
            } else {
                alert('Error: ' + (result.error || 'Posible email duplicado'));
            }
        } catch (error) {
            alert('Error de conexión');
        } finally {
            setLoading(false);
        }
    };

    // 3. Eliminar Usuario
    const handleDelete = async (id) => {
        // Evitar que te borres a ti mismo (opcional pero recomendado)
        const myId = localStorage.getItem('adminUserId');
        if (id == myId) {
            alert("No puedes eliminar tu propia cuenta.");
            return;
        }

        if (window.confirm("¿Seguro que quieres eliminar este administrador?")) {
            await fetch(`${API_URL}&id=${id}`, { method: 'DELETE' });
            fetchUsers();
        }
    };

    return (
        <div className="manage-catalog-container">
            <div className="catalog-header">
                <button onClick={() => navigate('/admin/dashboard')} className="back-btn-simple">
                    <ArrowLeft size={18} style={{marginRight:'5px'}}/> Volver
                </button>
                <h1>Gestor de Usuarios (Admins)</h1>
            </div>

            <div className="admin-grid">
                {/* Formulario de Creación */}
                <div className="upload-section" style={{borderLeft:'4px solid #9b59b6'}}>
                    <h2>Crear Nuevo Admin</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label>Email</label>
                            <input
                                type="email"
                                placeholder="nombre@itsstones.com"
                                className="admin-input"
                                value={newUser.email}
                                onChange={e => setNewUser({...newUser, email: e.target.value})}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Contraseña Inicial</label>
                            <input
                                type="password"
                                placeholder="Contraseña temporal"
                                className="admin-input"
                                value={newUser.password}
                                onChange={e => setNewUser({...newUser, password: e.target.value})}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Rol / Permisos</label>
                            <select
                                className="admin-input"
                                value={newUser.role}
                                onChange={e => setNewUser({...newUser, role: e.target.value})}
                            >
                                <option value="superadmin">Super Admin (Acceso Total)</option>
                                <option value="editor">Editor (Solo Contenido)</option>
                            </select>
                        </div>

                        <button type="submit" className="save-btn" disabled={loading} style={{backgroundColor:'#8e44ad'}}>
                            {loading ? 'Creando...' : 'Crear Usuario'}
                        </button>
                    </form>
                </div>

                {/* Lista de Usuarios */}
                <div className="list-section">
                    <h2>Admins Activos ({users.length})</h2>
                    <div className="minerals-list">
                        {users.map(u => (
                            <div key={u.id} className="mineral-item-admin" style={{justifyContent:'space-between', padding:'15px', alignItems:'center'}}>
                                <div style={{display:'flex', alignItems:'center', gap:'15px'}}>
                                    <div style={{background:'#f0f0f0', padding:'10px', borderRadius:'50%'}}>
                                        <Shield size={24} color="#555"/>
                                    </div>
                                    <div>
                                        <h3 style={{margin:0, fontSize:'1.1rem'}}>{u.email}</h3>
                                        <div style={{display:'flex', gap:'5px', marginTop:'5px'}}>
                                            <span style={{
                                                fontSize:'0.75rem',
                                                padding:'2px 8px',
                                                borderRadius:'4px',
                                                background: u.role === 'superadmin' ? '#d4edda' : '#fff3cd',
                                                color: u.role === 'superadmin' ? '#155724' : '#856404',
                                                fontWeight: 'bold'
                                            }}>
                                                {u.role ? u.role.toUpperCase() : 'UNKNOWN'}
                                            </span>
                                            {u.must_change_password == 1 && (
                                                <span style={{fontSize:'0.75rem', color:'red', border:'1px solid red', padding:'0 5px', borderRadius:'4px'}}>
                                                    Pwd Reset
                                                </span>
                                            )}
                                        </div>
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