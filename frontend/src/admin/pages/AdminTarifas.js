import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, X } from 'lucide-react';
import api from '../../services/api';
import AdminLayout from '../components/AdminLayout';
import '../components/AdminLayout.css';

const FORM_VAZIO = { nome: '', descricao: '', tipo: 'pacote', valor: '', ativo: true };
const TIPOS = ['pacote', 'extra', 'deslocacao'];

function AdminTarifas() {
    const [itens, setItens]       = useState([]);
    const [loading, setLoading]   = useState(true);
    const [modal, setModal]       = useState(false);
    const [editando, setEditando] = useState(null);
    const [form, setForm]         = useState(FORM_VAZIO);
    const [erro, setErro]         = useState('');
    const [salvando, setSalvando] = useState(false);
    const [filtroTipo, setFiltroTipo] = useState('todos');

    const carregar = () => {
        setLoading(true);
        api.get('/tarifas/admin/todos')
            .then(r => setItens(r.data.dados))
            .catch(console.error)
            .finally(() => setLoading(false));
    };

    useEffect(() => { carregar(); }, []);

    const abrirCriar = () => { setEditando(null); setForm(FORM_VAZIO); setErro(''); setModal(true); };
    const abrirEditar = (item) => {
        setEditando(item);
        setForm({ nome: item.nome, descricao: item.descricao || '', tipo: item.tipo, valor: item.valor, ativo: item.ativo });
        setErro(''); setModal(true);
    };

    const guardar = async (e) => {
        e.preventDefault(); setErro(''); setSalvando(true);
        try {
            editando ? await api.put(`/tarifas/admin/${editando.id}`, form) : await api.post('/tarifas/admin', form);
            setModal(false); carregar();
        } catch (err) {
            setErro(err.response?.data?.mensagem || 'Erro ao guardar.');
        } finally { setSalvando(false); }
    };

    const eliminar = async (id) => {
        if (!window.confirm('Eliminar esta tarifa?')) return;
        try { await api.delete(`/tarifas/admin/${id}`); carregar(); } catch { alert('Erro ao eliminar.'); }
    };

    const itensFiltrados = filtroTipo === 'todos' ? itens : itens.filter(i => i.tipo === filtroTipo);

    const corTipo = { pacote: '#7b5ea7', extra: '#c9857a', deslocacao: '#5c8a85' };

    return (
        <AdminLayout>
            <div className="admin-page-header">
                <div><h1>Tarifas</h1><p>Gerir preços da calculadora</p></div>
                <button className="admin-btn admin-btn-primary" onClick={abrirCriar}><Plus size={16} /> Nova Tarifa</button>
            </div>

            {/* Filtros */}
            <div style={{display:'flex', gap:'0.5rem', marginBottom:'1.5rem', flexWrap:'wrap'}}>
                {['todos', ...TIPOS].map(t => (
                    <button key={t} className={`admin-btn admin-btn-sm ${filtroTipo === t ? 'admin-btn-primary' : 'admin-btn-outline'}`} onClick={() => setFiltroTipo(t)}>
                        {t === 'todos' ? 'Todos' : t.charAt(0).toUpperCase() + t.slice(1)}
                    </button>
                ))}
            </div>

            {loading ? <div className="admin-loading">A carregar...</div> : (
                <div className="admin-table-wrap">
                    <table className="admin-table">
                        <thead><tr><th>Nome</th><th>Tipo</th><th>Valor (MZN)</th><th>Estado</th><th>Acções</th></tr></thead>
                        <tbody>
                            {itensFiltrados.length === 0 ? (
                                <tr><td colSpan="5" className="admin-vazio">Nenhuma tarifa encontrada.</td></tr>
                            ) : itensFiltrados.map(t => (
                                <tr key={t.id}>
                                    <td>
                                        <strong>{t.nome}</strong>
                                        {t.descricao && <><br /><small style={{color:'#8b6555'}}>{t.descricao}</small></>}
                                    </td>
                                    <td>
                                        <span className="badge" style={{background:`${corTipo[t.tipo]}18`, color:corTipo[t.tipo], border:`1px solid ${corTipo[t.tipo]}40`}}>
                                            {t.tipo.charAt(0).toUpperCase() + t.tipo.slice(1)}
                                        </span>
                                    </td>
                                    <td><strong>{Number(t.valor).toLocaleString('pt-MZ', {minimumFractionDigits:2})}</strong></td>
                                    <td><span className={`badge ${t.ativo ? 'badge-ativo' : 'badge-inativo'}`}>{t.ativo ? 'Activo' : 'Inactivo'}</span></td>
                                    <td>
                                        <div className="admin-table-acoes">
                                            <button className="admin-btn admin-btn-outline admin-btn-sm" onClick={() => abrirEditar(t)}><Pencil size={14} /></button>
                                            <button className="admin-btn admin-btn-danger admin-btn-sm" onClick={() => eliminar(t.id)}><Trash2 size={14} /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {modal && (
                <div className="admin-modal-overlay" onClick={() => setModal(false)}>
                    <div className="admin-modal" onClick={e => e.stopPropagation()}>
                        <div className="admin-modal-header">
                            <h2>{editando ? 'Editar Tarifa' : 'Nova Tarifa'}</h2>
                            <button className="admin-modal-fechar" onClick={() => setModal(false)}><X size={20} /></button>
                        </div>
                        {erro && <p className="admin-erro-msg">{erro}</p>}
                        <form className="admin-form" onSubmit={guardar}>
                            <div className="admin-form-grupo">
                                <label>Nome *</label>
                                <input value={form.nome} onChange={e => setForm({...form, nome: e.target.value})} required placeholder="Ex: Pacote Essencial" />
                            </div>
                            <div className="admin-form-row">
                                <div className="admin-form-grupo">
                                    <label>Tipo *</label>
                                    <select value={form.tipo} onChange={e => setForm({...form, tipo: e.target.value})}>
                                        {TIPOS.map(t => <option key={t} value={t}>{t.charAt(0).toUpperCase()+t.slice(1)}</option>)}
                                    </select>
                                </div>
                                <div className="admin-form-grupo">
                                    <label>Valor (MZN)</label>
                                    <input type="number" min="0" step="0.01" value={form.valor} onChange={e => setForm({...form, valor: e.target.value})} placeholder="0.00" />
                                </div>
                            </div>
                            <div className="admin-form-grupo">
                                <label>Descrição</label>
                                <input value={form.descricao} onChange={e => setForm({...form, descricao: e.target.value})} placeholder="Descrição opcional..." />
                            </div>
                            <div className="admin-form-grupo">
                                <label>Estado</label>
                                <select value={form.ativo} onChange={e => setForm({...form, ativo: e.target.value === 'true'})}>
                                    <option value="true">Activo</option>
                                    <option value="false">Inactivo</option>
                                </select>
                            </div>
                            <div className="admin-form-acoes">
                                <button type="button" className="admin-btn admin-btn-outline" onClick={() => setModal(false)}>Cancelar</button>
                                <button type="submit" className="admin-btn admin-btn-primary" disabled={salvando}>{salvando ? 'A guardar...' : 'Guardar'}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}

export default AdminTarifas;
