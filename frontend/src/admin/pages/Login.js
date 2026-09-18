import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Login.css';

function AdminLogin() {
    const [form, setForm]       = useState({ email: '', password: '' });
    const [erro, setErro]       = useState('');
    const [loading, setLoading] = useState(false);
    const { login }             = useAuth();
    const navigate              = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErro('');
        setLoading(true);
        try {
            await login(form.email, form.password);
            navigate('/admin/dashboard');
        } catch (err) {
            setErro(err.response?.data?.mensagem || 'Credenciais inválidas.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="admin-login-page">
            <div className="admin-login-card">
                <div className="admin-login-logo">
                    <span className="admin-logo-icon">✦</span>
                    <h1>Ornamentação</h1>
                    <p>Área Administrativa</p>
                </div>

                <form className="admin-login-form" onSubmit={handleSubmit}>
                    <div className="admin-form-grupo">
                        <label>Email</label>
                        <input
                            type="email"
                            value={form.email}
                            onChange={e => setForm({ ...form, email: e.target.value })}
                            placeholder="admin@ornamentacao.mz"
                            required
                            autoFocus
                        />
                    </div>
                    <div className="admin-form-grupo">
                        <label>Password</label>
                        <input
                            type="password"
                            value={form.password}
                            onChange={e => setForm({ ...form, password: e.target.value })}
                            placeholder="••••••••"
                            required
                        />
                    </div>
                    {erro && <p className="admin-login-erro">{erro}</p>}
                    <button type="submit" className="admin-login-btn" disabled={loading}>
                        {loading ? 'A entrar...' : 'Entrar'}
                    </button>
                </form>

                <a href="/" className="admin-login-voltar">← Voltar ao site</a>
            </div>
        </div>
    );
}

export default AdminLogin;
