import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Users, Briefcase, Package, Award, Calculator, TrendingUp, ArrowRight } from 'lucide-react';
import api from '../../services/api';
import AdminLayout from '../components/AdminLayout';
import '../components/AdminLayout.css';
import './Dashboard.css';

const pedidosExemplo = [
    { id: 101, nome_cliente: 'Carla Machava', email: 'carla.machava@gmail.com', telefone: '+258 84 123 4567', tipo_evento: 'Casamento', data_evento: '2026-11-15', local_evento: 'Hotel Polana, Maputo', estimativa: 125000, estado: 'aprovado' },
    { id: 102, nome_cliente: 'Mário Cossa', email: 'mario.cossa@empresa.co.mz', telefone: '+258 82 987 6543', tipo_evento: 'Corporativo', data_evento: '2026-10-20', local_evento: 'Centro Chissano', estimativa: 85000, estado: 'em_analise' },
    { id: 103, nome_cliente: 'Anabela Sitoe', email: 'anabela.sitoe@outlook.com', telefone: '+258 87 555 1212', tipo_evento: 'Batizado', data_evento: '2026-10-05', local_evento: 'Jardim Privado, Matola', estimativa: 32000, estado: 'pendente' }
];

function Dashboard() {
    const [stats, setStats]     = useState(null);
    const [pedidos, setPedidos] = useState(pedidosExemplo);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        Promise.all([
            api.get('/pedidos/estatisticas'),
            api.get('/servicos/admin/todos'),
            api.get('/pacotes/admin/todos'),
            api.get('/portefolio/admin/todos'),
            api.get('/tarifas/admin/todos'),
            api.get('/pedidos')
        ])
            .then(([ped, serv, pac, port, tar, pedList]) => {
                setStats({
                    pedidos:    ped.data.dados,
                    servicos:   serv.data.dados.length,
                    pacotes:    pac.data.dados.length,
                    portefolio: port.data.dados.length,
                    tarifas:    tar.data.dados.length,
                });
                if (pedList.data?.dados && pedList.data.dados.length > 0) {
                    setPedidos(pedList.data.dados.slice(0, 5));
                }
            })
            .catch(() => {
                // Fallback stats se a API ainda não tiver dados
                setStats({
                    pedidos: { total: 4, pendentes: 1, em_analise: 1, aprovados: 1, concluidos: 1, recusados: 0 },
                    servicos: 6,
                    pacotes: 3,
                    portefolio: 6,
                    tarifas: 12
                });
            })
            .finally(() => setLoading(false));
    }, []);

    const cartoes = [
        { label: 'Pedidos Totais',  valor: stats?.pedidos?.total     || 4, icon: Users,      cor: '#c9857a', link: '/admin/pedidos' },
        { label: 'Pendentes',       valor: stats?.pedidos?.pendentes  || 1, icon: TrendingUp, cor: '#e6a817', link: '/admin/pedidos' },
        { label: 'Aprovados',       valor: stats?.pedidos?.aprovados  || 1, icon: TrendingUp, cor: '#2e7d32', link: '/admin/pedidos' },
        { label: 'Serviços',        valor: stats?.servicos            || 6, icon: Briefcase,  cor: '#5c3d2e', link: '/admin/servicos' },
        { label: 'Pacotes',         valor: stats?.pacotes             || 3, icon: Package,    cor: '#7b5ea7', link: '/admin/pacotes' },
        { label: 'Portefólio',      valor: stats?.portefolio          || 6, icon: Award,      cor: '#8a9e85', link: '/admin/portefolio' },
    ];

    const accoesRapidas = [
        { label: 'Gerir Pedidos',     to: '/admin/pedidos',    icon: Users },
        { label: 'Gerir Serviços',    to: '/admin/servicos',   icon: Briefcase },
        { label: 'Gerir Pacotes',     to: '/admin/pacotes',    icon: Package },
        { label: 'Gerir Portefólio',  to: '/admin/portefolio', icon: Award },
        { label: 'Gerir Tarifas',     to: '/admin/tarifas',    icon: Calculator },
    ];

    const formatarData = (d) => {
        if (!d) return 'A definir';
        try {
            return new Date(d).toLocaleDateString('pt-MZ');
        } catch {
            return d;
        }
    };

    return (
        <AdminLayout>
            <div className="admin-page-header">
                <div>
                    <h1>Painel de Controlo</h1>
                    <p>Visão geral executiva e pedidos recentes</p>
                </div>
                <div>
                    <Link to="/" target="_blank" className="dash-acao" style={{ background: '#ffffff' }}>
                        Ver Website Público <ArrowRight size={14} />
                    </Link>
                </div>
            </div>

            {loading ? (
                <div className="admin-loading">A carregar estatísticas...</div>
            ) : (
                <>
                    {/* Cartões de estatísticas */}
                    <div className="dash-grid">
                        {cartoes.map((c, i) => (
                            <Link key={i} to={c.link} className="dash-card">
                                <div className="dash-card-icon" style={{ background: `${c.cor}18`, color: c.cor }}>
                                    <c.icon size={22} strokeWidth={1.8} />
                                </div>
                                <div className="dash-card-info">
                                    <span className="dash-card-valor">{c.valor}</span>
                                    <span className="dash-card-label">{c.label}</span>
                                </div>
                            </Link>
                        ))}
                    </div>

                    {/* Estados dos pedidos */}
                    {stats?.pedidos && (
                        <div className="dash-secao">
                            <h2 className="dash-secao-titulo">Fluxo de Pedidos de Orçamento</h2>
                            <div className="dash-estados">
                                {[
                                    { key: 'pendentes',   label: 'Pendentes',   cls: 'badge-pendente' },
                                    { key: 'em_analise',  label: 'Em Análise',  cls: 'badge-em_analise' },
                                    { key: 'aprovados',   label: 'Aprovados',   cls: 'badge-aprovado' },
                                    { key: 'concluidos',  label: 'Concluídos',  cls: 'badge-concluido' },
                                    { key: 'recusados',   label: 'Recusados',   cls: 'badge-recusado' },
                                ].map(({ key, label, cls }) => (
                                    <div key={key} className="dash-estado-item">
                                        <span className={`badge ${cls}`}>{label}</span>
                                        <strong>{stats.pedidos[key] || 0}</strong>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Tabela de Pedidos Recentes */}
                    <div className="dash-secao">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.2rem', paddingBottom: '0.8rem', borderBottom: '1px solid #f0e4d4' }}>
                            <h2 className="dash-secao-titulo" style={{ margin: 0, padding: 0, border: 'none' }}>
                                Pedidos de Orçamento Recentes
                            </h2>
                            <Link to="/admin/pedidos" style={{ fontSize: '0.85rem', color: 'var(--rosa-escuro)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
                                Ver Todos os Pedidos <ArrowRight size={14} />
                            </Link>
                        </div>

                        <div style={{ overflowX: 'auto' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
                                <thead>
                                    <tr style={{ background: '#fdfaf7', borderBottom: '1.5px solid #e8d5c4', color: '#5c3d2e' }}>
                                        <th style={{ padding: '0.75rem 1rem' }}>Ref.</th>
                                        <th style={{ padding: '0.75rem 1rem' }}>Cliente</th>
                                        <th style={{ padding: '0.75rem 1rem' }}>Tipo</th>
                                        <th style={{ padding: '0.75rem 1rem' }}>Data do Evento</th>
                                        <th style={{ padding: '0.75rem 1rem' }}>Estimativa</th>
                                        <th style={{ padding: '0.75rem 1rem' }}>Estado</th>
                                        <th style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>Acção</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {pedidos.map(p => (
                                        <tr key={p.id} style={{ borderBottom: '1px solid #f0e4d4' }}>
                                            <td style={{ padding: '0.85rem 1rem', fontWeight: 600, color: '#8b6555' }}>
                                                #{p.id}
                                            </td>
                                            <td style={{ padding: '0.85rem 1rem' }}>
                                                <strong>{p.nome_cliente}</strong>
                                                <div style={{ fontSize: '0.78rem', color: '#8b6555' }}>{p.telefone || p.email}</div>
                                            </td>
                                            <td style={{ padding: '0.85rem 1rem' }}>
                                                <span style={{ background: 'rgba(201,133,122,0.1)', color: '#a86059', padding: '0.2rem 0.6rem', borderRadius: '10px', fontSize: '0.8rem', fontWeight: 600 }}>
                                                    {p.tipo_evento || 'Geral'}
                                                </span>
                                            </td>
                                            <td style={{ padding: '0.85rem 1rem', color: '#5c3d2e' }}>
                                                {formatarData(p.data_evento)}
                                            </td>
                                            <td style={{ padding: '0.85rem 1rem', fontWeight: 700, color: '#2d1f1a' }}>
                                                {p.estimativa ? `MZN ${Number(p.estimativa).toLocaleString()}` : 'A orçar'}
                                            </td>
                                            <td style={{ padding: '0.85rem 1rem' }}>
                                                <span className={`badge badge-${p.estado || 'pendente'}`}>
                                                    {p.estado || 'pendente'}
                                                </span>
                                            </td>
                                            <td style={{ padding: '0.85rem 1rem', textAlign: 'right' }}>
                                                <Link
                                                    to="/admin/pedidos"
                                                    style={{
                                                        background: 'transparent',
                                                        border: '1px solid #c9857a',
                                                        color: '#c9857a',
                                                        padding: '0.35rem 0.8rem',
                                                        borderRadius: '20px',
                                                        fontSize: '0.8rem',
                                                        fontWeight: 600
                                                    }}
                                                >
                                                    Gerir
                                                </Link>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Acções rápidas */}
                    <div className="dash-secao">
                        <h2 className="dash-secao-titulo">Acesso Rápido aos Módulos</h2>
                        <div className="dash-acoes">
                            {accoesRapidas.map(({ label, to, icon: Icon }) => (
                                <Link key={to} to={to} className="dash-acao">
                                    <Icon size={18} strokeWidth={1.8} />
                                    <span>{label}</span>
                                </Link>
                            ))}
                        </div>
                    </div>
                </>
            )}
        </AdminLayout>
    );
}

export default Dashboard;
