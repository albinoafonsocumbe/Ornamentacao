import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Check, Crown, Sparkles, HeartHandshake, ArrowRight, Calculator } from 'lucide-react';
import api from '../services/api';
import { pacotesDefault } from '../data/fallbackData';
import './Listagem.css';

function Pacotes() {
    const [pacotes, setPacotes] = useState(pacotesDefault);

    useEffect(() => {
        api.get('/pacotes')
            .then(res => {
                if (res.data?.dados && res.data.dados.length > 0) {
                    // Mescla os dados da API preservando itens detalhados se disponíveis
                    const dadosAtualizados = res.data.dados.map(apiPacote => {
                        const correspondente = pacotesDefault.find(
                            p => p.nome.toLowerCase().includes(apiPacote.nome.toLowerCase()) ||
                                 apiPacote.nome.toLowerCase().includes(p.nome.toLowerCase())
                        );
                        return {
                            ...apiPacote,
                            capacidade: correspondente?.capacidade || 'Eventos de Médio e Grande Porte',
                            itens: correspondente?.itens || [
                                'Cenografia e arranjos florais de destaque',
                                'Iluminação cénica e ambientação',
                                'Montagem e desmontagem profissional'
                            ],
                            badge: correspondente?.badge,
                            destaque: correspondente?.destaque || false
                        };
                    });
                    setPacotes(dadosAtualizados);
                }
            })
            .catch(() => {});
    }, []);

    return (
        <div className="pagina">
            <div className="pagina-header">
                <div className="header-linha">Planos Transparentes</div>
                <h1>Pacotes de <span>Cenografia</span></h1>
                <p>Escolha a opção ideal para a dimensão e o estilo do seu evento em Moçambique</p>
            </div>

            <div className="container" style={{ padding: '4rem 1.5rem' }}>
                <div className="secao-titulo" style={{ marginBottom: '3rem' }}>
                    <span className="badge-luxo">✦ Qualidade Sem Concessões</span>
                    <h2>Planos Desenhados para Encantar</h2>
                    <p className="secao-desc">
                        Todos os pacotes incluem consultoria de estilo, montagem com horas de antecedência e equipa dedicada no local.
                    </p>
                </div>

                <div className="grid" style={{ padding: '0', maxWidth: '1180px' }}>
                    {pacotes.map((p, i) => {
                        const isDestaque = p.destaque || i === 1;
                        return (
                            <div
                                key={p.id || i}
                                className={`item-card ${isDestaque ? 'destaque' : ''}`}
                                style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'space-between',
                                    textAlign: 'left',
                                    position: 'relative',
                                    borderWidth: isDestaque ? '2px' : '1px'
                                }}
                            >
                                {isDestaque && <div className="badge-popular">Mais Escolhido</div>}

                                <div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                                        <div className="item-icon-wrap" style={{ margin: '0' }}>
                                            {i === 0 && <HeartHandshake size={28} />}
                                            {i === 1 && <Sparkles size={28} />}
                                            {i >= 2 && <Crown size={28} />}
                                        </div>
                                        {p.capacidade && (
                                            <span style={{ fontSize: '0.78rem', color: 'var(--rosa-escuro)', fontWeight: 600, background: 'rgba(201,133,122,0.1)', padding: '0.3rem 0.8rem', borderRadius: '12px' }}>
                                                {p.capacidade}
                                            </span>
                                        )}
                                    </div>

                                    <h3 style={{ fontSize: '1.4rem', marginBottom: '0.5rem' }}>{p.nome}</h3>
                                    <p style={{ fontSize: '0.92rem', marginBottom: '1.5rem', minHeight: '48px' }}>{p.descricao}</p>

                                    <div style={{ margin: '1.2rem 0 1.8rem', paddingBottom: '1.2rem', borderBottom: '1px solid rgba(232, 212, 196, 0.6)' }}>
                                        <span style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--castanho-suave)' }}>
                                            Investimento
                                        </span>
                                        <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--castanho)', fontFamily: 'var(--font-serif)', marginTop: '0.2rem' }}>
                                            <span style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--rosa-escuro)', marginRight: '4px' }}>MZN</span>
                                            {Number(p.preco_base).toLocaleString()}
                                        </div>
                                    </div>

                                    <h4 style={{ fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--castanho-med)', marginBottom: '0.8rem' }}>
                                        O que está incluído:
                                    </h4>

                                    <ul className="lista-checks" style={{ margin: '0 0 2rem 0' }}>
                                        {(p.itens || []).map((item, idx) => (
                                            <li key={idx} className="check-item">
                                                <Check size={16} />
                                                <span>{item}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', marginTop: '1rem' }}>
                                    <Link
                                        to={`/contacto?pacote=${encodeURIComponent(p.nome)}&valor=${p.preco_base}`}
                                        className={isDestaque ? 'btn-primary' : 'btn-outline-rosa'}
                                        style={{ width: '100%', justifyContent: 'center' }}
                                    >
                                        Pedir Este Pacote <ArrowRight size={16} />
                                    </Link>
                                    <Link
                                        to={`/calculadora?pacote=${p.id || i + 1}`}
                                        style={{ fontSize: '0.82rem', textAlign: 'center', color: 'var(--castanho-suave)', textDecoration: 'underline' }}
                                    >
                                        <Calculator size={13} style={{ verticalAlign: 'middle', marginRight: '4px' }} />
                                        Personalizar com Extras na Calculadora
                                    </Link>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Bloco de Garantia de Qualidade */}
                <div style={{
                    marginTop: '4rem',
                    background: 'var(--branco)',
                    border: '1px solid rgba(232, 212, 196, 0.6)',
                    borderRadius: '20px',
                    padding: '2.5rem',
                    textAlign: 'center',
                    boxShadow: 'var(--sombra-suave)'
                }}>
                    <h3 style={{ fontSize: '1.3rem', color: 'var(--castanho)', marginBottom: '0.6rem' }}>
                        ✦ Precisa de um conceito 100% personalizado?
                    </h3>
                    <p style={{ color: 'var(--castanho-suave)', maxWidth: '650px', margin: '0 auto 1.5rem', fontSize: '0.95rem' }}>
                        Criamos cenários temáticos e desenhamos peças cenográficas exclusivas para galas, embaixadas, casamentos monumentais e marcas corporativas.
                    </p>
                    <Link to="/contacto" className="btn-secondary" style={{ background: 'var(--castanho)', color: '#ffffff' }}>
                        Falar com um Consultor de Cenografia
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default Pacotes;
