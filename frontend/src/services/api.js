import axios from 'axios';

// Em desenvolvimento o CRA proxy redireciona /api/* para localhost:3000
// Em produção usa a variável de ambiente REACT_APP_API_URL
const baseURL = process.env.REACT_APP_API_URL || '/api';

const api = axios.create({
    baseURL,
    timeout: 15000,
});

// Interceptor: injecto automático do token JWT nas chamadas admin
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('admin_token');
    if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
});

// Interceptor: se o token expirou (401/403), limpar sessão
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401 || error.response?.status === 403) {
            const isAdminRoute = window.location.pathname.startsWith('/admin');
            if (isAdminRoute && window.location.pathname !== '/admin/login') {
                localStorage.removeItem('admin_token');
                localStorage.removeItem('admin_dados');
                window.location.href = '/admin/login';
            }
        }
        return Promise.reject(error);
    }
);

export default api;
