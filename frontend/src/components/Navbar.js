import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Navbar.css';

const links = [
    { to: '/',            label: 'Início' },
    { to: '/sobre',       label: 'Sobre' },
    { to: '/servicos',    label: 'Serviços' },
    { to: '/eventos',     label: 'Eventos' },
    { to: '/pacotes',     label: 'Pacotes' },
    { to: '/portefolio',  label: 'Portefólio' },
    { to: '/calculadora', label: 'Calculadora' },
];

function Navbar() {
    const [scrolled, setScrolled]     = useState(false);
    const [menuAberto, setMenuAberto] = useState(false);
    const location = useLocation();

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 50);
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Fechar menu ao mudar de página
    useEffect(() => { setMenuAberto(false); }, [location]);

    // Bloquear scroll quando menu aberto
    useEffect(() => {
        document.body.style.overflow = menuAberto ? 'hidden' : '';
        return () => { document.body.style.overflow = ''; };
    }, [menuAberto]);

    return (
        <nav className={`navbar ${scrolled ? 'scrolled' : ''}`} role="navigation" aria-label="Navegação principal">
            <div className="navbar-logo">
                <Link to="/" aria-label="Ornamentação — Página inicial">
                    <span className="logo-icon" aria-hidden="true">✦</span>
                    Ornamentação
                </Link>
            </div>

            <button
                className={`menu-toggle ${menuAberto ? 'aberto' : ''}`}
                onClick={() => setMenuAberto(!menuAberto)}
                aria-label={menuAberto ? 'Fechar menu' : 'Abrir menu'}
                aria-expanded={menuAberto}
            >
                <span></span>
                <span></span>
                <span></span>
            </button>

            <ul className={`navbar-links ${menuAberto ? 'aberto' : ''}`}>
                {links.map(({ to, label }) => (
                    <li key={to}>
                        <Link
                            to={to}
                            className={location.pathname === to ? 'ativo' : ''}
                        >
                            {label}
                        </Link>
                    </li>
                ))}
                <li>
                    <Link to="/contacto" className="btn-nav-contacto">
                        Pedir Orçamento
                    </Link>
                </li>
            </ul>
        </nav>
    );
}

export default Navbar;
