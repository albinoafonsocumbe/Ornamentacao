import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, X } from 'lucide-react';
import api from '../../services/api';
import AdminLayout from '../components/AdminLayout';
import '../components/AdminLayout.css';

const FORM_VAZIO = { nome: '', descricao: '', preco_base: '', imagem: '', ativo: true };

function AdminServicos() {
    const [itens, setItens]     = useState([]);
    const [loading, setLoading] = useState(true);
    const [modal, setModal]     = useState(false);
    const [editando, setEditando] = useState(null);
    const [form, setForm]       = useState(FORM_VAZIO);
    const [erro, setErro]       = useState('');
    const [salvando, setSalvando] = useState(false);

    const carregar = () => {
        setLoading(true);
        api.get('/servicos/admin/todos')
            .then(r => setItens(r.data.dados))
            .catch(console.error)
            .finally(() => setLoading(false));
    };

    useEffect(() => { carregar(); }, []);

    const abrirCriar = () => {
        setEditando(null);
        setForm(FORM_VAZIO);
        setErro('');
        setModal(true);
    };

    const abrirEditar = (item) => {
        setEditando(item);
        setForm({ nome: item.nome, descricao: item.descricao || '', preco_base: item.preco_base, imagem: item.imagem || '', ativo: item.ativo });
        setErro('');
        setModal(true);
    };

    const guardar = async (e) => {
        e.preventDefault();
        setErro('');
        setSalvando(true);
        try {
            if (editando) {
                await api.put(`/servicos/admin/${editando.id}`, form);
            } else {
                await api.post('/servicos/admin', form);
            }
            setModal(false);
            carregar();
        } catch (err) {
            setErro(err.response?.data?.mensagem || 'Erro ao guardar.');
        } finally {
            setSalvando(false);
        }
    };

    const eliminar = async (id) => {
        if (!window.confirm('Eliminar este serviço?')) return;
        try {
            await api.delete(`/servicos/admin/${id}`);
            carregar();
        } catch { alert('Erro ao eliminar.'); }
    };

    return (
        <AdminLayout>
            <div className="admin-page-header">
                <div><h1>Serviços</h1><p>Gerir os serviços disponíveis</p></div>
                <button className="admin-btn admin-btn-primary" onClick={abrirCriar}>
                    <Plus size={16} /> Novo Serviço
                </button>
            </div>

            {loading ? <div className="admin-loading">A carregar...</div> : (
                <div className="admin-table-wrap">
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>Nome</th>
                                <th>Preço Base (MZN)</th>
                                <th>Estado</th>
                                <th>Acções</th>
                            </tr>
                        </thead>
                        <tbody>
                            {itens.length === 0 ? (
                                <tr><td colSpan="4" className="admin-vazio">Nenhum serviço registado.</td></tr>
                            ) : itens.map(s => (
                                <tr key={s.id}>
                                    <td><strong>{s.nome}</strong><br /><small style={{color:'#8b6555'}}>{s.descricao?.slice(0,60)}{s.descricao?.length > 60 ? '...' : ''}</small></td>
                                    <td>{Number(s.preco_base).toLocaleString('pt-MZ', {minimumFractionDigits:2})}</td>
                                    <td><span className={`badge ${s.ativo ? 'badge-ativo' : 'badge-inativo'}`}>{s.ativo ? 'Activo' : 'Inactivo'}</span></td>
                                    <td>
                                        <div className="admin-table-acoes">
                                            <button className="admin-btn admin-btn-outline admin-btn-sm" onClick={() => abrirEditar(s)}><Pencil size={14} /></button>
                                            <button className="admin-btn admin-btn-danger admin-btn-sm" onClick={() => eliminar(s.id)}><Trash2 size={14} /></button>
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
                            <h2>{editando ? 'Editar Serviço' : 'Novo Serviço'}</h2>
                            <button className="admin-modal-fechar" onClick={() => setModal(false)}><X size={20} /></button>
                        </div>
                        {erro && <p className="admin-erro-msg">{erro}</p>}
                        <form className="admin-form" onSubmit={guardar}>
                            <div className="admin-form-grupo">
                                <label>Nome *</label>
                                <input value={form.nome} onChange={e => setForm({...form, nome: e.target.value})} required placeholder="Ex: Decoração de Casamento" />
                            </div>
                            <div className="admin-form-grupo">
                                <label>Descrição</label>
                                <textarea value={form.descricao} onChange={e => setForm({...form, descricao: e.target.value})} placeholder="Descrição do serviço..." />
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
                            <div className="admin-form-grupo">
                                <label>URL da Imagem</label>
                                <input value={form.imagem} onChange={e => setForm({...form, imagem: e.target.value})} placeholder="https://..." />
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

export default AdminServicos;
