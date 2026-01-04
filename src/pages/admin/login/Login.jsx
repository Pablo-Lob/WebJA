import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    // Make sure this points to your real API
    const LOGIN_URL = 'https://itsstonesfzco.com/api.php?table=admin_users&action=login';
    // Or if you handle login in a separate file: 'https://itsstonesfzco.com/login.php'

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const formData = new FormData();
            formData.append('email', email);
            formData.append('password', password);

            // Assuming your backend expects POST to login
            const response = await fetch('https://itsstonesfzco.com/login.php', {
                method: 'POST',
                body: formData
            });

            const result = await response.json();

            if (result.status === 'success') {
                localStorage.setItem('adminToken', result.token);
                localStorage.setItem('adminUserId', result.user.id);
                localStorage.setItem('adminRole', result.user.role || 'editor');

                // Redirect based on password reset requirement
                if (result.user.must_change_password == 1) {
                    navigate('/admin/change-password');
                } else {
                    navigate('/admin/dashboard');
                }
            } else {
                setError(result.message || 'Invalid credentials');
            }
        } catch (err) {
            setError('Connection error. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-container">
            <div className="login-card">
                <div className="login-header">
                    <h2>Admin Panel</h2>
                    <p>Secure Access</p>
                </div>

                <form onSubmit={handleSubmit} className="login-form">
                    {error && <div className="login-error">{error}</div>}

                    <div className="form-group">
                        <label htmlFor="email">Email Address</label>
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
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter your password"
                            required
                        />
                    </div>

                    <button type="submit" className="login-button" disabled={loading}>
                        {loading ? 'Verifying...' : 'Login'}
                    </button>
                </form>

                <div className="login-footer">
                    <a href="/">← Back to Website</a>
                </div>
            </div>
        </div>
    );
};

export default Login;