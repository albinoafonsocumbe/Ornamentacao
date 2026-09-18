import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Flower2, Heart, Sparkles, Building2, Cake, Gift, ArrowRight, Check } from 'lucide-react';
import api from '../services/api';
import { servicosDefault } from '../data/fallbackData';
import './Listagem.css';

const icones = [Heart, Sparkles, Building2, Gift, Cake, Flower2];

function Servicos() {
    const [servicos, setServicos] = useState(servicosDefault);

    useEffect(() => {
        api.get('/servicos')
            .then(res => {
                if (res.data?.dados && res.data.dados.length > 0) {
                    // Mescla dados da API enriquecendo com destaques se existirem no fallback
                    const dadosAtualizados = res.data.dados.map(apiServico => {
                        const correspondente = servicosDefault.find(
                            s => s.nome.toLowerCase().includes(apiServico.nome.toLowerCase())
                        );
                        return {
                            ...apiServico,
                            destaques: correspondente?.destaques || [
                                'Concepção e planeamento cenográfico',
                                'Mobiliário e peças decorativas nobres',
                                'Montagem rigorosa e apoio no local'
                            ],
                            imagem: apiServico.imagem || correspondente?.imagem
                        };
                    });
                    setServicos(dadosAtualizados);
                }
            })
            .catch(() => {});
    }, []);

    return (
        <div className="pagina">
            <div className="pagina-header">
                <div className="header-linha">Experiência & Excelência</div>
                <h1>Os Nossos <span>Serviços</span></h1>
                <p>Cenografia integral e decoração personalizada para todos os tipos de celebração em Moçambique</p>
            </div>

            <div className="container" style={{ padding: '4rem 1.5rem' }}>
                <div className="grid" style={{ padding: 0 }}>
                    {servicos.map((s, i) => {
                        const Icone = icones[i % icones.length];
                        return (
                            <div
                                key={s.id || i}
                                className="item-card"
                                style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'space-between',
                                    textAlign: 'left'
                                }}
                            >
                                <div>
                                    {s.imagem && (
                                        <div style={{ height: '180px', borderRadius: '16px', overflow: 'hidden', marginBottom: '1.2rem' }}>
                                            <img
                                                src={s.imagem}
                                                alt={s.nome}
                                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                                loading="lazy"
                                            />
                                        </div>
                                    )}

                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.8rem' }}>
                                        <div className="item-icon-wrap" style={{ margin: 0, width: '48px', height: '48px' }}>
                                            <Icone size={22} strokeWidth={1.5} />
                                        </div>
                                        <span className="preco-tag" style={{ fontSize: '0.82rem' }}>
                                            A partir de MZN {Number(s.preco_base).toLocaleString()}
                                        </span>
                                    </div>

                                    <h3 style={{ fontSize: '1.3rem', marginBottom: '0.6rem' }}>{s.nome}</h3>
                                    <p style={{ fontSize: '0.9rem', color: 'var(--castanho-suave)', lineHeight: '1.7', marginBottom: '1.2rem' }}>
                                        {s.descricao}
                                    </p>

                                    {s.destaques && (
                                        <ul className="lista-checks" style={{ margin: '0 0 1.5rem', gap: '0.5rem' }}>
                                            {s.destaques.map((item, idx) => (
                                                <li key={idx} className="check-item" style={{ fontSize: '0.84rem' }}>
                                                    <Check size={14} />
                                                    <span>{item}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </div>

                                <Link
                                    to={`/contacto?tipo=${encodeURIComponent(s.nome)}`}
                                    className="btn-outline-rosa"
                                    style={{ width: '100%', justifyContent: 'center', marginTop: '1rem' }}
                                >
                                    Solicitar Orçamento para este Serviço <ArrowRight size={15} />
                                </Link>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}

export default Servicos;
