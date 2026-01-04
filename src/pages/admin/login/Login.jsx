import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

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

            if (result.status === 'success') {
                // 1. Guardar Token e ID
                localStorage.setItem('adminToken', result.token);
                localStorage.setItem('adminUserId', result.user.id);

                // 2. IMPORTANTE: Guardar el ROL para usarlo en el Dashboard
                // (Asegúrate de que tu login.php devuelva 'role' dentro de 'user')
                localStorage.setItem('adminRole', result.user.role || 'editor');

                // 3. Lógica de Cambio de Contraseña (ACTIVADA)
                // Si la base de datos dice que debe cambiarla, lo mandamos allí
                if (result.user.must_change_password == 1) {
                    navigate('/admin/change-password');
                } else {
                    navigate('/admin/dashboard');
                }
            } else {
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
                    <h1>Panel de Administración</h1>
                    <p>Acceso seguro ITS-Stones</p>
                </div>

                <form onSubmit={handleSubmit} className="login-form">
                    {error && <div className="login-error">{error}</div>}

                    <div className="form-group">
                        <label htmlFor="email">Correo Electrónico</label>
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
                            placeholder="Introduce tu contraseña"
                            required
                        />
                    </div>

                    <button type="submit" className="login-button" disabled={loading}>
                        {loading ? 'Verificando...' : 'Entrar'}
                    </button>
                </form>

                <div className="login-footer">
                    <a href="/">← Volver a la web</a>
                </div>
            </div>
        </div>
    );
};

export default Login;