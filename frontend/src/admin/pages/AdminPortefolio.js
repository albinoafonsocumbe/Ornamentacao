import { useEffect, useState, useRef } from 'react';
import { Plus, Pencil, Trash2, X, Image } from 'lucide-react';
import api from '../../services/api';
import AdminLayout from '../components/AdminLayout';
import '../components/AdminLayout.css';

const FORM_VAZIO = { titulo: '', descricao: '', categoria: '', ativo: true };

function AdminPortefolio() {
    const [itens, setItens]     = useState([]);
    const [loading, setLoading] = useState(true);
    const [modal, setModal]     = useState(false);
    const [editando, setEditando] = useState(null);
    const [form, setForm]       = useState(FORM_VAZIO);
    const [ficheiro, setFicheiro] = useState(null);
    const [preview, setPreview] = useState('');
    const [erro, setErro]       = useState('');
    const [salvando, setSalvando] = useState(false);
    const inputFicheiroRef      = useRef();

    const carregar = () => {
        setLoading(true);
        api.get('/portefolio/admin/todos')
            .then(r => setItens(r.data.dados))
            .catch(console.error)
            .finally(() => setLoading(false));
    };

    useEffect(() => { carregar(); }, []);

    const abrirCriar = () => {
        setEditando(null); setForm(FORM_VAZIO);
        setFicheiro(null); setPreview(''); setErro(''); setModal(true);
    };

    const abrirEditar = (item) => {
        setEditando(item);
        setForm({ titulo: item.titulo, descricao: item.descricao || '', categoria: item.categoria || '', ativo: item.ativo });
        setFicheiro(null);
        setPreview(item.imagem ? `http://localhost:3000${item.imagem}` : '');
        setErro(''); setModal(true);
    };

    const onFicheiro = (e) => {
        const f = e.target.files[0];
        if (!f) return;
        setFicheiro(f);
        setPreview(URL.createObjectURL(f));
    };

    const guardar = async (e) => {
        e.preventDefault(); setErro(''); setSalvando(true);
        try {
            const dados = new FormData();
            dados.append('titulo', form.titulo);
            dados.append('descricao', form.descricao);
            dados.append('categoria', form.categoria);
            dados.append('ativo', form.ativo);
            if (ficheiro) dados.append('imagem', ficheiro);

            if (editando) {
                await api.put(`/portefolio/admin/${editando.id}`, dados, { headers: { 'Content-Type': 'multipart/form-data' } });
            } else {
                await api.post('/portefolio/admin', dados, { headers: { 'Content-Type': 'multipart/form-data' } });
            }
            setModal(false); carregar();
        } catch (err) {
            setErro(err.response?.data?.mensagem || 'Erro ao guardar.');
        } finally { setSalvando(false); }
    };

    const eliminar = async (id) => {
        if (!window.confirm('Eliminar este item do portefólio?')) return;
        try { await api.delete(`/portefolio/admin/${id}`); carregar(); } catch { alert('Erro ao eliminar.'); }
    };

    return (
        <AdminLayout>
            <div className="admin-page-header">
                <div><h1>Portefólio</h1><p>Gerir as imagens do portefólio</p></div>
                <button className="admin-btn admin-btn-primary" onClick={abrirCriar}><Plus size={16} /> Nova Imagem</button>
            </div>

            {loading ? <div className="admin-loading">A carregar...</div> : (
                <div className="admin-port-grid">
                    {itens.length === 0 ? (
                        <p className="admin-vazio">Nenhum item no portefólio.</p>
                    ) : itens.map(item => (
                        <div key={item.id} className={`admin-port-card ${!item.ativo ? 'inativo' : ''}`}>
                            <div className="admin-port-img">
                                {item.imagem
                                    ? <img src={`http://localhost:3000${item.imagem}`} alt={item.titulo} loading="lazy" decoding="async" />
                                    : <div className="admin-port-sem-img"><Image size={32} /></div>
                                }
                                {!item.ativo && <span className="admin-port-badge-inativo">Inactivo</span>}
                            </div>
                            <div className="admin-port-info">
                                <strong>{item.titulo}</strong>
                                {item.categoria && <span className="badge" style={{background:'#fdf5f0',color:'#c9857a',border:'1px solid #e8b4ae',fontSize:'0.72rem'}}>{item.categoria}</span>}
                            </div>
                            <div className="admin-port-acoes">
                                <button className="admin-btn admin-btn-outline admin-btn-sm" onClick={() => abrirEditar(item)}><Pencil size={14} /></button>
                                <button className="admin-btn admin-btn-danger admin-btn-sm" onClick={() => eliminar(item.id)}><Trash2 size={14} /></button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {modal && (
                <div className="admin-modal-overlay" onClick={() => setModal(false)}>
                    <div className="admin-modal" onClick={e => e.stopPropagation()}>
                        <div className="admin-modal-header">
                            <h2>{editando ? 'Editar Item' : 'Nova Imagem'}</h2>
                            <button className="admin-modal-fechar" onClick={() => setModal(false)}><X size={20} /></button>
                        </div>
                        {erro && <p className="admin-erro-msg">{erro}</p>}
                        <form className="admin-form" onSubmit={guardar}>
                            {/* Preview / Upload */}
                            <div
                                className="admin-upload-area"
                                onClick={() => inputFicheiroRef.current.click()}
                            >
                                {preview
                                    ? <img src={preview} alt="preview" style={{width:'100%',height:'160px',objectFit:'cover',borderRadius:'10px'}} />
                                    : <div className="admin-upload-placeholder"><Image size={32} /><p>{editando ? 'Clique para alterar imagem' : 'Clique para escolher imagem *'}</p></div>
                                }
                                <input ref={inputFicheiroRef} type="file" accept="image/*" style={{display:'none'}} onChange={onFicheiro} />
                            </div>

                            <div className="admin-form-grupo">
                                <label>Título *</label>
                                <input value={form.titulo} onChange={e => setForm({...form, titulo: e.target.value})} required placeholder="Ex: Decoração Casamento Silva" />
                            </div>
                            <div className="admin-form-row">
                                <div className="admin-form-grupo">
                                    <label>Categoria</label>
                                    <input value={form.categoria} onChange={e => setForm({...form, categoria: e.target.value})} placeholder="Ex: Casamento" />
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
                                <label>Descrição</label>
                                <textarea value={form.descricao} onChange={e => setForm({...form, descricao: e.target.value})} placeholder="Breve descrição..." />
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

export default AdminPortefolio;
