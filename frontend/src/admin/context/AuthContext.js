import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [admin, setAdmin]   = useState(null);
    const [loading, setLoading] = useState(true);

    // Ao arrancar, verificar se há token guardado
    useEffect(() => {
        const token = localStorage.getItem('admin_token');
        const dados = localStorage.getItem('admin_dados');
        if (token && dados) {
            api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            setAdmin(JSON.parse(dados));
        }
        setLoading(false);
    }, []);

    const login = useCallback(async (email, password) => {
        const res = await api.post('/auth/login', { email, password });
        const { token, admin: dadosAdmin } = res.data;
        localStorage.setItem('admin_token', token);
        localStorage.setItem('admin_dados', JSON.stringify(dadosAdmin));
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        setAdmin(dadosAdmin);
        return dadosAdmin;
    }, []);

    const logout = useCallback(() => {
        localStorage.removeItem('admin_token');
        localStorage.removeItem('admin_dados');
        delete api.defaults.headers.common['Authorization'];
        setAdmin(null);
    }, []);

    return (
        <AuthContext.Provider value={{ admin, loading, login, logout, autenticado: !!admin }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error('useAuth deve ser usado dentro de AuthProvider');
    return ctx;
}
