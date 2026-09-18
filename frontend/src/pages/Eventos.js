import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, GraduationCap, Briefcase, Sparkles, Star, ArrowRight } from 'lucide-react';
import api from '../services/api';
import './Listagem.css';

const eventosDefault = [
    {
        id: 1,
        nome: 'Casamentos & Noivados',
        descricao: 'O dia mais especial da sua vida com cenografia romântica, passarela cerimonial, altar florido e recepção de gala memorável.',
        imagem: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=800&q=80'
    },
    {
        id: 2,
        nome: 'Galas & Eventos Corporativos',
        descricao: 'Cenários executivos de alto padrão para lançamentos de produtos, jantares de gala, conferências e premiações empresariais.',
        imagem: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80'
    },
    {
        id: 3,
        nome: 'Aniversários & Festas Glamour',
        descricao: 'Celebrações que marcam uma época (15, 30, 40, 50 anos) com lounges VIP em veludo, iluminação cénica e painéis contemporâneos.',
        imagem: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=800&q=80'
    },
    {
        id: 4,
        nome: 'Batizados & Comunhões',
        descricao: 'Pureza e harmonia em arranjos florais delicados, tons celestiais e arcos orgânicos para acolher a família com ternura.',
        imagem: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=800&q=80'
    },
    {
        id: 5,
        nome: 'Cerimónias Tradicionais (Lobolo)',
        descricao: 'Fusão perfeita entre a sofisticação moderna e a riqueza das tradições culturais moçambicanas com tecidos e detalhes nobres.',
        imagem: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800&q=80'
    },
    {
        id: 6,
        nome: 'Formaturas & Conquistas Académicas',
        descricao: 'Cenários vibrantes e elegantes para celebrar grandes vitórias académicas com amigos, familiares e colegas de curso.',
        imagem: 'https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=800&q=80'
    }
];

const icones = [Heart, Briefcase, Sparkles, Star, Heart, GraduationCap];

function Eventos() {
    const [eventos, setEventos] = useState(eventosDefault);

    useEffect(() => {
        api.get('/eventos')
            .then(res => {
                if (res.data?.dados && res.data.dados.length > 0) {
                    const dadosAtualizados = res.data.dados.map((apiEvento, idx) => ({
                        ...apiEvento,
                        imagem: apiEvento.imagem || eventosDefault[idx % eventosDefault.length].imagem
                    }));
                    setEventos(dadosAtualizados);
                }
            })
            .catch(() => {});
    }, []);

    return (
        <div className="pagina">
            <div className="pagina-header">
                <div className="header-linha">Ocasiões Memoráveis</div>
                <h1>Tipos de <span>Eventos</span></h1>
                <p>Experiência consolidada em cenografia para os mais variados formatos e dimensões de celebração</p>
            </div>

            <div className="container" style={{ padding: '4rem 1.5rem' }}>
                <div className="grid" style={{ padding: 0 }}>
                    {eventos.map((e, i) => {
                        const Icone = icones[i % icones.length];
                        return (
                            <div
                                key={e.id || i}
                                className="item-card"
                                style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'space-between',
                                    textAlign: 'left'
                                }}
                            >
                                <div>
                                    {e.imagem && (
                                        <div style={{ height: '180px', borderRadius: '16px', overflow: 'hidden', marginBottom: '1.2rem' }}>
                                            <img
                                                src={e.imagem}
                                                alt={e.nome}
                                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                                loading="lazy"
                                            />
                                        </div>
                                    )}

                                    <div className="item-icon-wrap" style={{ margin: '0 0 1rem', width: '48px', height: '48px' }}>
                                        <Icone size={22} strokeWidth={1.5} />
                                    </div>

                                    <h3 style={{ fontSize: '1.3rem', marginBottom: '0.6rem' }}>{e.nome}</h3>
                                    <p style={{ fontSize: '0.9rem', color: 'var(--castanho-suave)', lineHeight: '1.7', marginBottom: '1.5rem' }}>
                                        {e.descricao}
                                    </p>
                                </div>

                                <Link
                                    to={`/contacto?tipo=${encodeURIComponent(e.nome)}`}
                                    className="btn-outline-rosa"
                                    style={{ width: '100%', justifyContent: 'center' }}
                                >
                                    Planear este Tipo de Evento <ArrowRight size={15} />
                                </Link>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}

export default Eventos;
