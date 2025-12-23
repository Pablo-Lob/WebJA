import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './styles/Login.css';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    // Asegúrate de que esta URL sea correcta en producción
    const LOGIN_URL = 'https://itsstonesfzco.com/login.php';

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const formData = new FormData();
            formData.append('email', email);
            formData.append('password', password);

            const response = await fetch(LOGIN_URL, {
                method: 'POST',
                body: formData
            });

            const result = await response.json();

            // --- CORRECCIÓN AQUÍ ---
            // Verificamos result.status === 'success' (como lo envía el PHP)
            if (result.status === 'success') {

                // Guardamos el token real
                localStorage.setItem('adminToken', result.token);

                // Guardamos el ID para posibles cambios de contraseña
                localStorage.setItem('adminUserId', result.user.id);

                // Verificamos si está obligado a cambiar contraseña
                if (result.user.must_change_password) {
                    navigate('/admin/change-password');
                } else {
                    navigate('/admin/dashboard');
                }
            } else {
                // Si el PHP devuelve error (status: "error")
                setError(result.message || 'Credenciales incorrectas');
            }
        } catch (error) {
            console.error("Error login:", error);
            setError('Error de conexión con el servidor');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-container">
            <div className="login-card">
                <div className="login-header">
                    <h1>Admin Login</h1>
                    <p>Accede al panel de administración</p>
                </div>

                <form onSubmit={handleSubmit} className="login-form">
                    {error && <div className="login-error">{error}</div>}

                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="admin@itsstones.com"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">Contraseña</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Ingresa tu contraseña"
                            required
                        />
                    </div>

                    <button type="submit" className="login-button" disabled={loading}>
                        {loading ? 'Verificando...' : 'Iniciar Sesión'}
                    </button>
                </form>

                <div className="login-footer">
                    <a href="/">← Volver al sitio</a>
                </div>
            </div>
        </div>
    );
};

export default Login;