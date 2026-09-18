import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
    LayoutList, Package, Briefcase, Users, Calculator,
    LogOut, Menu, X, Award, ChevronRight
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import './AdminLayout.css';

const navItems = [
    { to: '/admin/dashboard',  label: 'Dashboard',  icon: LayoutList },
    { to: '/admin/pedidos',    label: 'Pedidos',     icon: Users },
    { to: '/admin/servicos',   label: 'Serviços',    icon: Briefcase },
    { to: '/admin/pacotes',    label: 'Pacotes',     icon: Package },
    { to: '/admin/portefolio', label: 'Portefólio',  icon: Award },
    { to: '/admin/tarifas',    label: 'Tarifas',     icon: Calculator },
];

function AdminLayout({ children }) {
    const { admin, logout } = useAuth();
    const navigate          = useNavigate();
    const [sidebarAberta, setSidebarAberta] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/admin/login');
    };

    return (
        <div className="admin-layout">
            {/* Overlay mobile */}
            {sidebarAberta && (
                <div className="admin-overlay" onClick={() => setSidebarAberta(false)} />
            )}

            {/* Sidebar */}
            <aside className={`admin-sidebar ${sidebarAberta ? 'aberta' : ''}`}>
                <div className="admin-sidebar-logo">
                    <span className="admin-sidebar-icon">✦</span>
                    <div>
                        <h2>Ornamentação</h2>
                        <p>Painel Admin</p>
                    </div>
                </div>

                <nav className="admin-nav">
                    {navItems.map(({ to, label, icon: Icon }) => (
                        <NavLink
                            key={to}
                            to={to}
                            className={({ isActive }) => `admin-nav-link ${isActive ? 'activo' : ''}`}
                            onClick={() => setSidebarAberta(false)}
                        >
                            <Icon size={18} strokeWidth={1.8} />
                            <span>{label}</span>
                            <ChevronRight size={14} className="nav-chevron" />
                        </NavLink>
                    ))}
                </nav>

                <div className="admin-sidebar-footer">
                    <div className="admin-user">
                        <div className="admin-user-avatar">
                            {admin?.nome?.charAt(0).toUpperCase()}
                        </div>
                        <div className="admin-user-info">
                            <strong>{admin?.nome}</strong>
                            <span>{admin?.email}</span>
                        </div>
                    </div>
                    <button className="admin-logout-btn" onClick={handleLogout} title="Sair">
                        <LogOut size={18} strokeWidth={1.8} />
                    </button>
                </div>
            </aside>

            {/* Conteúdo principal */}
            <div className="admin-main">
                {/* Topbar mobile */}
                <header className="admin-topbar">
                    <button
                        className="admin-menu-btn"
                        onClick={() => setSidebarAberta(!sidebarAberta)}
                        aria-label="Menu"
                    >
                        {sidebarAberta ? <X size={22} /> : <Menu size={22} />}
                    </button>
                    <span className="admin-topbar-logo">✦ Ornamentação</span>
                    <button className="admin-logout-btn-mobile" onClick={handleLogout}>
                        <LogOut size={18} />
                    </button>
                </header>

                <div className="admin-content">
                    {children}
                </div>
            </div>
        </div>
    );
}

export default AdminLayout;
