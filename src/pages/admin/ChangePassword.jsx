import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './login/Login.css';

const ChangePassword = () => {
    const navigate = useNavigate();
    const [pass, setPass] = useState('');
    const [confirm, setConfirm] = useState('');

    // Recuperamos el ID del usuario del localStorage (lo guardaremos en Login)
    const userId = localStorage.getItem('adminUserId');

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (pass !== confirm) return alert("Las contraseñas no coinciden");
        if (pass.length < 6) return alert("Mínimo 6 caracteres");

        const formData = new FormData();
        formData.append('action', 'change_password');
        formData.append('id', userId);
        formData.append('new_password', pass);

        const res = await fetch('https://itsstonesfzco.com/api.php?table=admin_users', {
            method: 'POST', body: formData
        });
        const result = await res.json();

        if (result.status === 'success') {
            alert("Contraseña actualizada. Inicia sesión de nuevo.");
            localStorage.clear(); // Limpiamos todo
            navigate('/admin/login');
        } else {
            alert("Error al actualizar");
        }
    };

    return (
        <div className="login-container">
            <div className="login-card">
                <h1>Cambio Obligatorio</h1>
                <p>Por seguridad, debes cambiar tu contraseña.</p>
                <form onSubmit={handleSubmit} className="login-form">
                    <input type="password" placeholder="Nueva Contraseña" value={pass} onChange={e=>setPass(e.target.value)} required />
                    <input type="password" placeholder="Confirmar Contraseña" value={confirm} onChange={e=>setConfirm(e.target.value)} required />
                    <button type="submit" className="login-button">Actualizar</button>
                </form>
            </div>
        </div>
    );
};

export default ChangePassword;