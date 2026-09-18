import { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Grid2x2, LayoutList, MapPin, Sparkles, ArrowRight, X } from 'lucide-react';
import api from '../services/api';
import LazyImg from '../components/LazyImg';
import { portefolioDefault } from '../data/fallbackData';
import './Portefolio.css';

const API_BASE = process.env.REACT_APP_API_URL?.replace('/api', '') || 'http://localhost:3000';

function Portefolio() {
    const [itens, setItens]                 = useState(portefolioDefault);
    const [categorias, setCategorias]       = useState(['Todos', 'Casamentos', 'Corporativo', 'Aniversários', 'Batizados']);
    const [categoriaActiva, setCategoriaActiva] = useState('Todos');
    const [vista, setVista]                 = useState('grelha');
    const [loading, setLoading]             = useState(false);
    const [imagemAberta, setImagemAberta]   = useState(null);

    useEffect(() => {
        Promise.all([
            api.get('/portefolio'),
            api.get('/portefolio/categorias'),
        ])
            .then(([resItens, resCats]) => {
                if (resItens.data?.dados && resItens.data.dados.length > 0) {
                    setItens(resItens.data.dados);
                }
                if (resCats.data?.dados && resCats.data.dados.length > 0) {
                    setCategorias(['Todos', ...resCats.data.dados]);
                }
            })
            .catch(() => {})
            .finally(() => setLoading(false));
    }, []);

    // Fechar lightbox com Escape
    useEffect(() => {
        const handler = (e) => { if (e.key === 'Escape') setImagemAberta(null); };
        window.addEventListener('keydown', handler);
        return () => window.removeEventListener('keydown', handler);
    }, []);

    const abrirImagem = useCallback((item) => {
        setImagemAberta(item);
        document.body.style.overflow = 'hidden';
    }, []);

    const fecharImagem = useCallback(() => {
        setImagemAberta(null);
        document.body.style.overflow = '';
    }, []);

    const itensFiltrados = categoriaActiva === 'Todos'
        ? itens
        : itens.filter(i => i.categoria === categoriaActiva);

    const imgUrl = (path) => {
        if (!path) return '';
        if (path.startsWith('http')) return path;
        return `${API_BASE}${path}`;
    };

    return (
        <div className="portefolio-pagina">
            {/* Header */}
            <div className="pagina-header">
                <div className="header-linha">Galeria de Inspiração</div>
                <h1>O Nosso <span>Portefólio</span></h1>
                <p>Cenários reais criados para casamentos, galas e momentos inesquecíveis em Moçambique</p>
            </div>

            {/* Controlos */}
            <div className="portefolio-controlos">
                <div className="filtros" role="group" aria-label="Filtrar por categoria">
                    {categorias.map(cat => (
                        <button
                            key={cat}
                            className={`filtro-btn ${categoriaActiva === cat ? 'activo' : ''}`}
                            onClick={() => setCategoriaActiva(cat)}
                            aria-pressed={categoriaActiva === cat}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
                <div className="vista-btns" role="group" aria-label="Modo de visualização">
                    <button
                        className={`vista-btn ${vista === 'grelha' ? 'activo' : ''}`}
                        onClick={() => setVista('grelha')}
                        title="Grelha"
                        aria-label="Vista em grelha"
                    >
                        <Grid2x2 size={18} />
                    </button>
                    <button
                        className={`vista-btn ${vista === 'lista' ? 'activo' : ''}`}
                        onClick={() => setVista('lista')}
                        title="Lista"
                        aria-label="Vista em lista"
                    >
                        <LayoutList size={18} />
                    </button>
                </div>
            </div>

            {/* Galeria */}
            {loading ? (
                <p className="loading">A carregar trabalhos...</p>
            ) : itensFiltrados.length === 0 ? (
                <div className="sem-itens">
                    <p>Nenhum item encontrado para esta categoria.</p>
                </div>
            ) : (
                <div className={`portefolio-galeria ${vista}`} role="list">
                    {itensFiltrados.map(item => (
                        <div
                            key={item.id}
                            className="portefolio-item"
                            role="listitem"
                            onClick={() => abrirImagem(item)}
                            onKeyDown={(e) => e.key === 'Enter' && abrirImagem(item)}
                            tabIndex={0}
                            aria-label={`Ver detalhes: ${item.titulo}`}
                        >
                            <div className="portefolio-img-wrap">
                                <LazyImg
                                    src={imgUrl(item.imagem)}
                                    alt={item.titulo}
                                />
                                <div className="portefolio-overlay" aria-hidden="true">
                                    <span>Ver detalhes & Ampliar</span>
                                </div>
                            </div>
                            <div className="portefolio-info">
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                                    {item.categoria && (
                                        <span className="categoria-tag">{item.categoria}</span>
                                    )}
                                    {item.local && (
                                        <span style={{ fontSize: '0.75rem', color: 'var(--castanho-suave)', display: 'flex', alignItems: 'center', gap: '3px' }}>
                                            <MapPin size={12} /> {item.local}
                                        </span>
                                    )}
                                </div>
                                <h3>{item.titulo}</h3>
                                {item.descricao && (
                                    <p style={{ fontSize: '0.84rem', color: 'var(--castanho-suave)', marginTop: '0.3rem', lineHeight: '1.5' }}>
                                        {item.descricao}
                                    </p>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Banner inferior de acção */}
            <div className="container" style={{ margin: '4rem auto', textAlign: 'center' }}>
                <div style={{
                    background: 'var(--branco)',
                    border: '1px solid rgba(232, 212, 196, 0.6)',
                    borderRadius: '20px',
                    padding: '2.5rem 1.5rem',
                    boxShadow: 'var(--sombra-suave)'
                }}>
                    <Sparkles size={24} color="var(--dourado)" style={{ marginBottom: '0.5rem' }} />
                    <h3 style={{ fontSize: '1.4rem', color: 'var(--castanho)', marginBottom: '0.5rem' }}>
                        Gostou de algum dos nossos cenários?
                    </h3>
                    <p style={{ color: 'var(--castanho-suave)', maxWidth: '550px', margin: '0 auto 1.5rem', fontSize: '0.95rem' }}>
                        Podemos reproduzir ou adaptar qualquer um destes conceitos para o espaço da sua celebração.
                    </p>
                    <Link to="/contacto" className="btn-primary">
                        Solicitar Orçamento Inspirado na Galeria <ArrowRight size={16} />
                    </Link>
                </div>
            </div>

            {/* Modal lightbox */}
            {imagemAberta && (
                <div
                    className="lightbox"
                    onClick={fecharImagem}
                    role="dialog"
                    aria-modal="true"
                    aria-label={`Imagem: ${imagemAberta.titulo}`}
                >
                    <div className="lightbox-content" onClick={e => e.stopPropagation()}>
                        <button
                            className="lightbox-fechar"
                            onClick={fecharImagem}
                            aria-label="Fechar"
                        >
                            <X size={20} />
                        </button>
                        <img
                            src={imgUrl(imagemAberta.imagem)}
                            alt={imagemAberta.titulo}
                            decoding="async"
                        />
                        <div className="lightbox-info" style={{ padding: '1.8rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                                {imagemAberta.categoria && (
                                    <span className="categoria-tag">{imagemAberta.categoria}</span>
                                )}
                                {imagemAberta.local && (
                                    <span style={{ fontSize: '0.8rem', color: 'var(--castanho-suave)', display: 'flex', alignItems: 'center', gap: '3px' }}>
                                        <MapPin size={13} /> {imagemAberta.local}
                                    </span>
                                )}
                            </div>

                            <h2 style={{ fontSize: '1.4rem', color: 'var(--castanho)', marginBottom: '0.5rem' }}>
                                {imagemAberta.titulo}
                            </h2>

                            {imagemAberta.descricao && (
                                <p style={{ color: 'var(--castanho-suave)', lineHeight: '1.7', fontSize: '0.92rem', marginBottom: '1.2rem' }}>
                                    {imagemAberta.descricao}
                                </p>
                            )}

                            <Link
                                to={`/contacto?tipo=${encodeURIComponent(imagemAberta.categoria || 'Evento')}&referencia=${encodeURIComponent(imagemAberta.titulo)}`}
                                className="btn-primary"
                                style={{ width: '100%', justifyContent: 'center' }}
                            >
                                Solicitar Cenografia Semelhante a Esta
                            </Link>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Portefolio;
