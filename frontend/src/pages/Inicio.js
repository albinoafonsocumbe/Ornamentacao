import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
    Palette, Clock, Gem, Handshake, ArrowRight, Star,
    Users, Award, Check, Calculator
} from 'lucide-react';
import api from '../services/api';
import { servicosDefault, pacotesDefault } from '../data/fallbackData';
import './Inicio.css';

function Inicio() {
    const [servicos, setServicos] = useState(servicosDefault);
    const [pacotes, setPacotes]   = useState(pacotesDefault);

    useEffect(() => {
        api.get('/servicos')
            .then(res => {
                if (res.data?.dados && res.data.dados.length > 0) {
                    setServicos(res.data.dados);
                }
            })
            .catch(() => {});

        api.get('/pacotes')
            .then(res => {
                if (res.data?.dados && res.data.dados.length > 0) {
                    setPacotes(res.data.dados);
                }
            })
            .catch(() => {});
    }, []);

    return (
        <div className="inicio">

            {/* ── HERO ── */}
            <section className="hero">
                <div className="hero-deco" aria-hidden="true"></div>
                <div className="hero-content">
                    <p className="hero-label">✦ Decoração Premium & Cenografia em Inhambane</p>
                    <h1>Transformamos os seus<br /><span>momentos especiais</span></h1>
                    <p className="hero-sub">
                        Criamos atmosferas exclusivas e inesquecíveis para casamentos,
                        galas corporativas, aniversários e celebrações únicas em Inhambane, Maxixe,
                        Praia do Tofo, Barra, Vilankulo e toda a província.
                    </p>
                    <div className="hero-btns">
                        <Link to="/contacto" className="btn-primary">
                            Pedir Orçamento Gratuito <ArrowRight size={16} />
                        </Link>
                        <Link to="/calculadora" className="btn-secondary">
                            <Calculator size={16} /> Simular na Calculadora
                        </Link>
                    </div>
                    <div className="hero-stats">
                        <div className="stat">
                            <Users size={20} strokeWidth={1.5} className="stat-icon" />
                            <span>200+</span>
                            <p>Eventos Realizados</p>
                        </div>
                        <div className="stat-sep"></div>
                        <div className="stat">
                            <Star size={20} strokeWidth={1.5} className="stat-icon" />
                            <span>5.0</span>
                            <p>Avaliação de Satisfação</p>
                        </div>
                        <div className="stat-sep"></div>
                        <div className="stat">
                            <Award size={20} strokeWidth={1.5} className="stat-icon" />
                            <span>8+</span>
                            <p>Anos de Experiência</p>
                        </div>
                    </div>
                </div>
                <div className="hero-scroll">
                    <span>Explorar</span>
                    <div className="scroll-line"></div>
                </div>
            </section>

            {/* ── PORQUÊ NÓS ── */}
            <section className="porque-nos">
                <div className="container">
                    <div className="secao-titulo">
                        <p className="label-rosa">A Nossa Diferença</p>
                        <h2>Porquê escolher a Ornamentação?</h2>
                        <p className="secao-desc">Combinamos estética contemporânea, sensibilidade artística e rigor executivo absoluto na Província de Inhambane.</p>
                    </div>
                    <div className="features-grid">
                        <div className="feature">
                            <div className="feature-icon-wrap"><Palette size={28} strokeWidth={1.5} /></div>
                            <h3>Design Exclusivo</h3>
                            <p>Cada projecto é concebido sob medida. Criamos conceitos visuais únicos que reflectem a personalidade dos anfitriões.</p>
                        </div>
                        <div className="feature">
                            <div className="feature-icon-wrap"><Clock size={28} strokeWidth={1.5} /></div>
                            <h3>Pontualidade Rigorosa</h3>
                            <p>Respeito absoluto pelos cronogramas. A nossa equipa conclui a montagem horas antes do início da celebração.</p>
                        </div>
                        <div className="feature">
                            <div className="feature-icon-wrap"><Gem size={28} strokeWidth={1.5} /></div>
                            <h3>Materiais & Flores Nobres</h3>
                            <p>Flores frescas seleccionadas, lustres de cristal, cadeiras de assinatura e peças decorativas de alto padrão.</p>
                        </div>
                        <div className="feature">
                            <div className="feature-icon-wrap"><Handshake size={28} strokeWidth={1.5} /></div>
                            <h3>Acompanhamento Integral</h3>
                            <p>Cuidamos de tudo, da concepção criativa 3D à coordenação no local e desmontagem pós-evento sem preocupações.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── COMO TRABALHAMOS (PASSO A PASSO) ── */}
            <section className="secao-processo">
                <div className="container">
                    <div className="secao-titulo">
                        <p className="label-rosa">Metodologia Impecável</p>
                        <h2>Como criamos a sua celebração</h2>
                        <p className="secao-desc">Um processo estruturado e transparente para garantir que cada detalhe supere as suas expectativas.</p>
                    </div>
                    <div className="passos-grid">
                        <div className="passo-card">
                            <span className="passo-num">01</span>
                            <h3>Briefing & Inspiração</h3>
                            <p>Reunimos consigo para compreender a sua história, tema pretendido, paleta de cores e preferências visuais.</p>
                        </div>
                        <div className="passo-card">
                            <span className="passo-num">02</span>
                            <h3>Proposta & Orçamento</h3>
                            <p>Desenvolvemos uma proposta detalhada com a selecção de cenografia, arranjos florais, mobiliário e orçamento transparente.</p>
                        </div>
                        <div className="passo-card">
                            <span className="passo-num">03</span>
                            <h3>Montagem & Cenografia</h3>
                            <p>A nossa equipa técnica e floral instala todos os elementos com precisão cirúrgica e iluminação cénica impecável.</p>
                        </div>
                        <div className="passo-card">
                            <span className="passo-num">04</span>
                            <h3>Momento Inesquecível</h3>
                            <p>A festa acontece em perfeita harmonia visual, garantindo memórias mágicas para si e para os seus convidados.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── SERVIÇOS ── */}
            <section className="secao-servicos">
                <div className="container">
                    <div className="secao-titulo">
                        <p className="label-rosa">Especialidades</p>
                        <h2>Os Nossos Serviços de Cenografia</h2>
                        <p className="secao-desc">Soluções completas de decoração personalizadas para cada tipo de celebração</p>
                    </div>
                    <div className="servicos-grid">
                        {servicos.slice(0, 3).map((s, i) => (
                            <div key={s.id || i} className="servico-card">
                                <div className="servico-num">0{i + 1}</div>
                                <h3>{s.nome}</h3>
                                <p>{s.descricao}</p>
                                <div className="servico-preco">
                                    A partir de MZN {Number(s.preco_base).toLocaleString()}
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="secao-cta">
                        <Link to="/servicos" className="btn-outline-rosa">
                            Ver Todos os Serviços <ArrowRight size={16} />
                        </Link>
                    </div>
                </div>
            </section>

            {/* ── BANNER ESTIMATIVA / CALCULADORA ── */}
            <section className="banner-calculadora">
                <div className="container banner-calc-inner">
                    <div className="banner-calc-texto">
                        <span className="badge-luxo">✦ Ferramenta Exclusiva</span>
                        <h2>Quer saber quanto custará a decoração do seu evento?</h2>
                        <p>
                            Use a nossa Calculadora de Estimativa Interactiva. Escolha o seu pacote,
                            adicione extras como iluminação ou pérgola floral, e receba um valor imediato!
                        </p>
                    </div>
                    <div className="banner-calc-cta">
                        <Link to="/calculadora" className="btn-primary">
                            <Calculator size={18} /> Simular Orçamento Agora
                        </Link>
                    </div>
                </div>
            </section>

            {/* ── PACOTES ── */}
            <section className="secao-pacotes">
                <div className="container">
                    <div className="secao-titulo claro">
                        <p className="label-rosa">Para Todos os Formatos</p>
                        <h2>Pacotes em Destaque</h2>
                        <p className="secao-desc claro-desc">Planos completos concebidos para oferecer a melhor experiência decorativa</p>
                    </div>
                    <div className="pacotes-grid">
                        {pacotes.map((p, i) => {
                            const isDestaque = i === 1 || p.destaque;
                            return (
                                <div key={p.id || i} className={`pacote-card ${isDestaque ? 'destaque' : ''}`}>
                                    {isDestaque && <div className="badge-popular">Mais Escolhido</div>}
                                    <h3>{p.nome}</h3>
                                    <div className="pacote-preco">
                                        <span>MZN</span> {Number(p.preco_base).toLocaleString()}
                                    </div>
                                    <p>{p.descricao}</p>

                                    {/* Lista de itens se disponível */}
                                    {p.itens && (
                                        <ul className="lista-checks">
                                            {p.itens.slice(0, 4).map((item, idx) => (
                                                <li key={idx} className="check-item">
                                                    <Check size={16} />
                                                    <span>{item}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    )}

                                    <Link
                                        to={`/contacto?pacote=${encodeURIComponent(p.nome)}`}
                                        className={isDestaque ? 'btn-primary' : 'btn-pacote-outline'}
                                    >
                                        Pedir Este Pacote <ArrowRight size={15} />
                                    </Link>
                                </div>
                            );
                        })}
                    </div>
                    <div className="secao-cta" style={{ marginTop: '3rem' }}>
                        <Link to="/pacotes" className="btn-secondary">
                            Comparar Todos os Pacotes em Detalhe
                        </Link>
                    </div>
                </div>
            </section>

            {/* ── CTA FINAL ── */}
            <section className="cta-final">
                <div className="container">
                    <p className="label-rosa">✦ Comece Hoje</p>
                    <h2>O seu evento especial em Inhambane<br />merece um cenário extraordinário</h2>
                    <p>Entre em contacto hoje mesmo e receba uma consultoria personalizada com orçamento gratuito.</p>
                    <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap', marginTop: '2rem' }}>
                        <Link to="/contacto" className="btn-primary">
                            Falar com a Nossa Equipa <ArrowRight size={16} />
                        </Link>
                        <Link to="/portefolio" className="btn-secondary">
                            Ver Galeria de Fotos
                        </Link>
                    </div>
                </div>
            </section>

        </div>
    );
}

export default Inicio;
