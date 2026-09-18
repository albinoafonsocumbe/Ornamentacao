import { useEffect, useState } from 'react';
import { Eye, Trash2, X } from 'lucide-react';
import api from '../../services/api';
import AdminLayout from '../components/AdminLayout';
import '../components/AdminLayout.css';

const ESTADOS = ['pendente', 'em_analise', 'aprovado', 'recusado', 'concluido'];

const labelEstado = {
    pendente:   'Pendente',
    em_analise: 'Em Análise',
    aprovado:   'Aprovado',
    recusado:   'Recusado',
    concluido:  'Concluído',
};

function AdminPedidos() {
    const [pedidos, setPedidos]   = useState([]);
    const [loading, setLoading]   = useState(true);
    const [detalhe, setDetalhe]   = useState(null);
    const [estadoForm, setEstadoForm] = useState('');
    const [notasForm, setNotasForm]   = useState('');
    const [salvando, setSalvando]     = useState(false);
    const [filtro, setFiltro]         = useState('todos');

    const carregar = () => {
        setLoading(true);
        api.get('/pedidos')
            .then(r => setPedidos(r.data.dados))
            .catch(console.error)
            .finally(() => setLoading(false));
    };

    useEffect(() => { carregar(); }, []);

    const abrirDetalhe = (p) => {
        setDetalhe(p);
        setEstadoForm(p.estado);
        setNotasForm(p.notas_admin || '');
    };

    const guardarEstado = async () => {
        setSalvando(true);
        try {
            await api.patch(`/pedidos/${detalhe.id}/estado`, { estado: estadoForm, notas_admin: notasForm });
            setDetalhe(null);
            carregar();
        } catch { alert('Erro ao actualizar estado.'); }
        finally { setSalvando(false); }
    };

    const eliminar = async (id) => {
        if (!window.confirm('Eliminar este pedido?')) return;
        try { await api.delete(`/pedidos/${id}`); carregar(); } catch { alert('Erro ao eliminar.'); }
    };

    const pedidosFiltrados = filtro === 'todos' ? pedidos : pedidos.filter(p => p.estado === filtro);

    return (
        <AdminLayout>
            <div className="admin-page-header">
                <div><h1>Pedidos</h1><p>{pedidos.length} pedidos registados</p></div>
            </div>

            {/* Filtros */}
            <div style={{display:'flex', gap:'0.5rem', flexWrap:'wrap', marginBottom:'1.5rem'}}>
                {['todos', ...ESTADOS].map(e => (
                    <button
                        key={e}
                        className={`admin-btn admin-btn-sm ${filtro === e ? 'admin-btn-primary' : 'admin-btn-outline'}`}
                        onClick={() => setFiltro(e)}
                    >
                        {e === 'todos' ? 'Todos' : labelEstado[e]}
                    </button>
                ))}
            </div>

            {loading ? <div className="admin-loading">A carregar...</div> : (
                <div className="admin-table-wrap">
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Cliente</th>
                                <th>Tipo Evento</th>
                                <th>Data Evento</th>
                                <th>Estimativa</th>
                                <th>Estado</th>
                                <th>Recebido</th>
                                <th>Acções</th>
                            </tr>
                        </thead>
                        <tbody>
                            {pedidosFiltrados.length === 0 ? (
                                <tr><td colSpan="8" className="admin-vazio">Nenhum pedido encontrado.</td></tr>
                            ) : pedidosFiltrados.map(p => (
                                <tr key={p.id}>
                                    <td style={{color:'#b5926e'}}>#{p.id}</td>
                                    <td>
                                        <strong>{p.nome_cliente}</strong><br />
                                        <small style={{color:'#8b6555'}}>{p.email}</small>
                                    </td>
                                    <td>{p.tipo_evento || '—'}</td>
                                    <td>{p.data_evento ? new Date(p.data_evento).toLocaleDateString('pt-MZ') : '—'}</td>
                                    <td>{p.estimativa ? `MZN ${Number(p.estimativa).toLocaleString()}` : '—'}</td>
                                    <td><span className={`badge badge-${p.estado}`}>{labelEstado[p.estado]}</span></td>
                                    <td style={{fontSize:'0.8rem',color:'#8b6555'}}>{new Date(p.criado_em).toLocaleDateString('pt-MZ')}</td>
                                    <td>
                                        <div className="admin-table-acoes">
                                            <button className="admin-btn admin-btn-outline admin-btn-sm" onClick={() => abrirDetalhe(p)}><Eye size={14} /></button>
                                            <button className="admin-btn admin-btn-danger admin-btn-sm" onClick={() => eliminar(p.id)}><Trash2 size={14} /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Modal detalhe */}
            {detalhe && (
                <div className="admin-modal-overlay" onClick={() => setDetalhe(null)}>
                    <div className="admin-modal" style={{maxWidth:'640px'}} onClick={e => e.stopPropagation()}>
                        <div className="admin-modal-header">
                            <h2>Pedido #{detalhe.id} — {detalhe.nome_cliente}</h2>
                            <button className="admin-modal-fechar" onClick={() => setDetalhe(null)}><X size={20} /></button>
                        </div>

                        {/* Info */}
                        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'0.6rem 1.5rem',marginBottom:'1.5rem',fontSize:'0.88rem'}}>
                            {[
                                ['Email', detalhe.email],
                                ['Telefone', detalhe.telefone || '—'],
                                ['Tipo de Evento', detalhe.tipo_evento || '—'],
                                ['Data do Evento', detalhe.data_evento ? new Date(detalhe.data_evento).toLocaleDateString('pt-MZ') : '—'],
                                ['Local', detalhe.local_evento || '—'],
                                ['Estimativa', detalhe.estimativa ? `MZN ${Number(detalhe.estimativa).toLocaleString()}` : '—'],
                            ].map(([k,v]) => (
                                <div key={k}>
                                    <span style={{color:'#8b6555',fontSize:'0.75rem',textTransform:'uppercase',fontWeight:600}}>{k}</span>
                                    <p style={{color:'#2d1f1a',marginTop:'0.15rem'}}>{v}</p>
                                </div>
                            ))}
                        </div>

                        {detalhe.descricao && (
                            <div style={{background:'#f9f4ef',borderRadius:'10px',padding:'1rem',marginBottom:'1.5rem',fontSize:'0.88rem',color:'#5c3d2e'}}>
                                <strong style={{fontSize:'0.75rem',textTransform:'uppercase',color:'#8b6555'}}>Descrição</strong>
                                <p style={{marginTop:'0.3rem'}}>{detalhe.descricao}</p>
                            </div>
                        )}

                        {/* Actualizar estado */}
                        <div style={{borderTop:'1px solid #f0e4d4',paddingTop:'1.2rem'}}>
                            <div className="admin-form-row">
                                <div className="admin-form-grupo">
                                    <label>Estado</label>
                                    <select value={estadoForm} onChange={e => setEstadoForm(e.target.value)}>
                                        {ESTADOS.map(s => <option key={s} value={s}>{labelEstado[s]}</option>)}
                                    </select>
                                </div>
                            </div>
                            <div className="admin-form-grupo" style={{marginTop:'0.8rem'}}>
                                <label>Notas Internas</label>
                                <textarea value={notasForm} onChange={e => setNotasForm(e.target.value)} placeholder="Notas visíveis apenas para a equipa..." rows="3" />
                            </div>
                            <div className="admin-form-acoes">
                                <button className="admin-btn admin-btn-outline" onClick={() => setDetalhe(null)}>Fechar</button>
                                <button className="admin-btn admin-btn-primary" onClick={guardarEstado} disabled={salvando}>{salvando ? 'A guardar...' : 'Guardar Estado'}</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}

export default AdminPedidos;
