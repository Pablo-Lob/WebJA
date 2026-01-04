import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Save, Trash2, ArrowLeft, UserPlus } from 'lucide-react';
import './ManageCatalog.css'; // Reusing catalog styles for consistency

const ManageAdmins = () => {
    const navigate = useNavigate();
    const [users, setUsers] = useState([]);

    // New User State
    const [newUser, setNewUser] = useState({
        email: '',
        password: '',
        role: 'editor'
    });

    const API_URL = 'https://itsstonesfzco.com/api.php?table=admin_users';

    useEffect(() => {
        const role = localStorage.getItem('adminRole');
        if (role !== 'superadmin') {
            alert("Access Denied: Super Admin permissions required.");
            navigate('/admin/dashboard');
        } else {
            fetchUsers();
        }
    }, [navigate]);

    const fetchUsers = async () => {
        try {
            const res = await fetch(`${API_URL}&t=${Date.now()}`);
            const data = await res.json();
            setUsers(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error("Error loading users:", error);
        }
    };

    const handleCreate = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('action', 'create');
        formData.append('email', newUser.email);
        formData.append('password', newUser.password);
        formData.append('role', newUser.role);

        try {
            const res = await fetch(API_URL, {
                method: 'POST',
                body: formData
            });
            const result = await res.json();
            if (result.status === 'success') {
                alert("User created successfully");
                setNewUser({ email: '', password: '', role: 'editor' });
                fetchUsers();
            } else {
                alert("Error: " + (result.error || "Could not create user"));
            }
        } catch (err) {
            alert("Connection error");
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this user?")) return;

        try {
            await fetch(`${API_URL}&id=${id}`, { method: 'DELETE' });
            fetchUsers();
        } catch (err) {
            alert("Error deleting user");
        }
    };

    return (
        <div className="manage-catalog-container">
            <div className="catalog-header">
                <button className="back-btn" onClick={() => navigate('/admin/dashboard')}>
                    <ArrowLeft size={20} />
                </button>
                <h2>Manage <span className="highlight">Administrators</span></h2>
            </div>

            <div className="admin-grid">
                {/* Create User Form */}
                <div className="upload-section">
                    <h3><UserPlus size={20} style={{marginRight:'10px', verticalAlign:'middle'}}/> Create New User</h3>
                    <form onSubmit={handleCreate} style={{marginTop:'20px'}}>
                        <div className="form-group">
                            <label>Email</label>
                            <input
                                type="email"
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
                                className="admin-input"
                                value={newUser.password}
                                onChange={e => setNewUser({...newUser, password: e.target.value})}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Role</label>
                            <select
                                className="admin-input"
                                value={newUser.role}
                                onChange={e => setNewUser({...newUser, role: e.target.value})}
                            >
                                <option value="editor">Editor</option>
                                <option value="superadmin">Super Admin</option>
                            </select>
                        </div>
                        <button type="submit" className="save-btn">
                            <Save size={18} style={{marginRight:'8px'}} /> CREATE USER
                        </button>
                    </form>
                </div>

                {/* Users List */}
                <div className="list-section">
                    <h3>Active Users ({users.length})</h3>
                    <div className="minerals-list">
                        {users.map(u => (
                            <div key={u.id} className="mineral-item-admin" style={{justifyContent:'space-between'}}>
                                <div>
                                    <strong style={{color:'white', display:'block', marginBottom:'5px'}}>{u.email}</strong>
                                    <div style={{display:'flex', gap:'10px', alignItems:'center'}}>
                                        <span style={{
                                            padding:'2px 8px',
                                            borderRadius:'4px',
                                            background: u.role === 'superadmin' ? '#d4edda' : '#fff3cd',
                                            color: u.role === 'superadmin' ? '#155724' : '#856404',
                                            fontWeight: 'bold',
                                            fontSize: '0.8rem'
                                        }}>
                                            {u.role ? u.role.toUpperCase() : 'UNKNOWN'}
                                        </span>
                                        {u.must_change_password == 1 && (
                                            <span style={{fontSize:'0.75rem', color:'#ff6b6b', border:'1px solid #ff6b6b', padding:'0 5px', borderRadius:'4px'}}>
                                                Pwd Reset Pending
                                            </span>
                                        )}
                                    </div>
                                </div>
                                <button onClick={() => handleDelete(u.id)} className="delete-btn" title="Delete User">
                                    <Trash2 size={18}/>
                                </button>
                            </div>
                        ))}
                        {users.length === 0 && <p style={{color:'#666', fontStyle:'italic'}}>No users found.</p>}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ManageAdmins;