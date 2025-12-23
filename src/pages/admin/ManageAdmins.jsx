import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './styles/ManageCatalog.css';

const ManageAdmins = () => {
    const navigate = useNavigate();
    const [users, setUsers] = useState([]);

    const [newUser, setNewUser] = useState({ email: '', password: '', role: 'editor' });

    const API_URL = 'https://itsstonesfzco.com/api.php?table=admin_users';

    // Cargar usuarios
    const fetchUsers = async () => {
        const res = await fetch(`${API_URL}&t=${Date.now()}`);
        const data = await res.json();
        setUsers(Array.isArray(data) ? data : []);
    };

    useEffect(() => { fetchUsers(); }, []);

    // Crear usuario
    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('action', 'create');
        formData.append('email', newUser.email);
        formData.append('password', newUser.password);
        formData.append('role', newUser.role);

        const res = await fetch('https://itsstonesfzco.com/api.php?table=admin_users', {
            method: 'POST', body: formData
        });
        const result = await res.json();

        if (result.status === 'success') {
            alert('Usuario creado. Deberá cambiar su contraseña al entrar.');
            setNewUser({ email: '', password: '', role: 'editor' });
            fetchUsers();
        } else {
            alert('Error: ' + (result.error || 'Desconocido'));
        }
    };

    // Borrar usuario
    const handleDelete = async (id) => {
        if(window.confirm('¿Borrar administrador?')) {
            await fetch(`${API_URL}&id=${id}`, { method: 'DELETE' });
            fetchUsers();
        }
    };

    return (
        <div className="manage-catalog-container">
            <div className="catalog-header">
                <button onClick={() => navigate('/admin/dashboard')} className="back-btn-simple">← Volver</button>
                <h1>Gestión de Administradores</h1>
            </div>

            <div className="admin-grid">
                {/* Formulario Crear */}
                <div className="upload-section">
                    <h2>Nuevo Usuario</h2>
                    <form onSubmit={handleSubmit}>
                        <input type="email" placeholder="Email" className="admin-input" required
                               value={newUser.email} onChange={e => setNewUser({...newUser, email: e.target.value})}/>

                        <input type="text" placeholder="Contraseña Temporal" className="admin-input" required
                               value={newUser.password} onChange={e => setNewUser({...newUser, password: e.target.value})}/>

                        <select className="admin-input" value={newUser.role} onChange={e => setNewUser({...newUser, role: e.target.value})}>
                            <option value="admin">Administrador Total</option>
                            <option value="editor">Editor (Contenido)</option>
                        </select>

                        <button type="submit" className="save-btn">Crear Usuario</button>
                    </form>
                </div>

                {/* Lista */}
                <div className="list-section">
                    <h2>Usuarios Activos</h2>
                    <div className="minerals-list">
                        {users.map(u => (
                            <div key={u.id} className="mineral-item-admin" style={{justifyContent:'space-between', padding:'15px'}}>
                                <div>
                                    <h3 style={{margin:0}}>{u.email}</h3>
                                    <span style={{fontSize:'0.8rem', color:'#aaa'}}>Rol: {u.role}</span>
                                    {u.must_change_password == 1 && <span style={{color:'orange', marginLeft:'10px', fontSize:'0.8rem'}}>⚠ Cambio Pendiente</span>}
                                </div>
                                <button onClick={() => handleDelete(u.id)} className="delete-btn">Eliminar</button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ManageAdmins;