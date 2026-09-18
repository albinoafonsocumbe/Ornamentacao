import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, X } from 'lucide-react';
import api from '../../services/api';
import AdminLayout from '../components/AdminLayout';
import '../components/AdminLayout.css';

const FORM_VAZIO = { nome: '', descricao: '', preco_base: '', ativo: true };

function AdminPacotes() {
    const [itens, setItens]     = useState([]);
    const [loading, setLoading] = useState(true);
    const [modal, setModal]     = useState(false);
    const [editando, setEditando] = useState(null);
    const [form, setForm]       = useState(FORM_VAZIO);
    const [erro, setErro]       = useState('');
    const [salvando, setSalvando] = useState(false);

    const carregar = () => {
        setLoading(true);
        api.get('/pacotes/admin/todos')
            .then(r => setItens(r.data.dados))
            .catch(console.error)
            .finally(() => setLoading(false));
    };

    useEffect(() => { carregar(); }, []);

    const abrirCriar = () => { setEditando(null); setForm(FORM_VAZIO); setErro(''); setModal(true); };
    const abrirEditar = (item) => {
        setEditando(item);
        setForm({ nome: item.nome, descricao: item.descricao || '', preco_base: item.preco_base, ativo: item.ativo });
        setErro(''); setModal(true);
    };

    const guardar = async (e) => {
        e.preventDefault(); setErro(''); setSalvando(true);
        try {
            editando ? await api.put(`/pacotes/admin/${editando.id}`, form) : await api.post('/pacotes/admin', form);
            setModal(false); carregar();
        } catch (err) {
            setErro(err.response?.data?.mensagem || 'Erro ao guardar.');
        } finally { setSalvando(false); }
    };

    const eliminar = async (id) => {
        if (!window.confirm('Eliminar este pacote?')) return;
        try { await api.delete(`/pacotes/admin/${id}`); carregar(); } catch { alert('Erro ao eliminar.'); }
    };

    return (
        <AdminLayout>
            <div className="admin-page-header">
                <div><h1>Pacotes</h1><p>Gerir os pacotes disponíveis</p></div>
                <button className="admin-btn admin-btn-primary" onClick={abrirCriar}><Plus size={16} /> Novo Pacote</button>
            </div>

            {loading ? <div className="admin-loading">A carregar...</div> : (
                <div className="admin-table-wrap">
                    <table className="admin-table">
                        <thead><tr><th>Nome</th><th>Preço Base (MZN)</th><th>Estado</th><th>Acções</th></tr></thead>
                        <tbody>
                            {itens.length === 0 ? (
                                <tr><td colSpan="4" className="admin-vazio">Nenhum pacote registado.</td></tr>
                            ) : itens.map(p => (
                                <tr key={p.id}>
                                    <td><strong>{p.nome}</strong><br /><small style={{color:'#8b6555'}}>{p.descricao?.slice(0,60)}{p.descricao?.length > 60 ? '...' : ''}</small></td>
                                    <td>{Number(p.preco_base).toLocaleString('pt-MZ', {minimumFractionDigits:2})}</td>
                                    <td><span className={`badge ${p.ativo ? 'badge-ativo' : 'badge-inativo'}`}>{p.ativo ? 'Activo' : 'Inactivo'}</span></td>
                                    <td>
                                        <div className="admin-table-acoes">
                                            <button className="admin-btn admin-btn-outline admin-btn-sm" onClick={() => abrirEditar(p)}><Pencil size={14} /></button>
                                            <button className="admin-btn admin-btn-danger admin-btn-sm" onClick={() => eliminar(p.id)}><Trash2 size={14} /></button>
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
                            <h2>{editando ? 'Editar Pacote' : 'Novo Pacote'}</h2>
                            <button className="admin-modal-fechar" onClick={() => setModal(false)}><X size={20} /></button>
                        </div>
                        {erro && <p className="admin-erro-msg">{erro}</p>}
                        <form className="admin-form" onSubmit={guardar}>
                            <div className="admin-form-grupo">
                                <label>Nome *</label>
                                <input value={form.nome} onChange={e => setForm({...form, nome: e.target.value})} required placeholder="Ex: Pacote Essencial" />
                            </div>
                            <div className="admin-form-grupo">
                                <label>Descrição</label>
                                <textarea value={form.descricao} onChange={e => setForm({...form, descricao: e.target.value})} placeholder="Descrição do pacote..." />
                            </div>
                            <div className="admin-form-row">
                                <div className="admin-form-grupo">
                                    <label>Preço Base (MZN)</label>
                                    <input type="number" min="0" step="0.01" value={form.preco_base} onChange={e => setForm({...form, preco_base: e.target.value})} placeholder="0.00" />
                                </div>
                                <div className="admin-form-grupo">
                                    <label>Estado</label>
                                    <select value={form.ativo} onChange={e => setForm({...form, ativo: e.target.value === 'true'})}>
                                        <option value="true">Activo</option>
                                        <option value="false">Inactivo</option>
                                    </select>
                                </div>
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

export default AdminPacotes;
