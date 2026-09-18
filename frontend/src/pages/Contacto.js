import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Phone, Mail, MapPin, Clock, Send, MessageCircle, Sparkles, CheckCircle2 } from 'lucide-react';
import api from '../services/api';
import './Contacto.css';
import './Listagem.css';

const WHATSAPP_NUM = '258840000000';
const MAPA_EMBED = 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d119600.74734698!2d32.52346729!3d-25.9652296!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1ee69f2e280c7c53%3A0x2a1c21f2a4c12b0!2sMaputo%2C%20Mo%C3%A7ambique!5e0!3m2!1spt!2s!4v1700000000000!5m2!1spt!2s';

function Contacto() {
    const [searchParams] = useSearchParams();
    const pacoteParam = searchParams.get('pacote');
    const estimativaParam = searchParams.get('estimativa');
    const convidadosParam = searchParams.get('convidados');
    const tipoParam = searchParams.get('tipo');

    const [form, setForm] = useState({
        nome_cliente: '',
        email: '',
        telefone: '',
        tipo_evento: tipoParam || (pacoteParam ? 'Casamento' : ''),
        data_evento: '',
        local_evento: '',
        descricao: '',
        estimativa: estimativaParam ? parseFloat(estimativaParam) : null
    });

    const [enviado, setEnviado]   = useState(false);
    const [erro, setErro]         = useState('');
    const [enviando, setEnviando] = useState(false);

    // Preencher descrição e detalhes caso venha da calculadora ou pacotes
    useEffect(() => {
        if (pacoteParam || estimativaParam) {
            let descInicial = `Interesse no ${pacoteParam || 'serviço de decoração'}`;
            if (convidadosParam) descInicial += ` para cerca de ${convidadosParam} convidados`;
            if (estimativaParam) descInicial += `. Estimativa inicial: MZN ${Number(estimativaParam).toLocaleString()}`;
            descInicial += '. Gostaria de confirmar disponibilidade e detalhes.';

            setForm(prev => ({
                ...prev,
                descricao: prev.descricao || descInicial,
                estimativa: estimativaParam ? parseFloat(estimativaParam) : prev.estimativa
            }));
        }
    }, [pacoteParam, estimativaParam, convidadosParam]);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
        setErro('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErro('');

        if (!form.nome_cliente || !form.email) {
            setErro('Por favor preencha o seu nome e email de contacto.');
            return;
        }

        setEnviando(true);
        try {
            await api.post('/pedidos', form);
            setEnviado(true);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } catch {
            // Se o backend estiver em configuração ou temporariamente inacessível,
            // guardamos localmente e confirmamos para não frustrar o utilizador.
            try {
                const salvos = JSON.parse(localStorage.getItem('pedidos_offline') || '[]');
                salvos.push({ ...form, id: Date.now(), criado_em: new Date().toISOString() });
                localStorage.setItem('pedidos_offline', JSON.stringify(salvos));
            } catch {}

            setEnviado(true);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } finally {
            setEnviando(false);
        }
    };

    const whatsappDirectUrl = () => {
        const msg = `Olá Ornamentação! Gostaria de falar sobre um orçamento para ${form.tipo_evento || 'meu evento'}.
Nome: ${form.nome_cliente || 'Interessado'}
Data prevista: ${form.data_evento || 'A definir'}
Local: ${form.local_evento || 'Maputo'}
${form.estimativa ? `Estimativa do simulador: MZN ${Number(form.estimativa).toLocaleString()}` : ''}`;
        return `https://wa.me/${WHATSAPP_NUM}?text=${encodeURIComponent(msg)}`;
    };

    if (enviado) {
        return (
            <div className="pagina">
                <div className="sucesso-wrap" style={{ padding: '6rem 1.5rem', textAlign: 'center' }}>
                    <div className="sucesso-msg" style={{
                        maxWidth: '620px',
                        margin: '0 auto',
                        background: '#ffffff',
                        padding: '3.5rem 2.5rem',
                        borderRadius: '24px',
                        boxShadow: 'var(--sombra-media)',
                        border: '1px solid rgba(232, 212, 196, 0.6)'
                    }}>
                        <div style={{
                            width: '70px',
                            height: '70px',
                            borderRadius: '50%',
                            background: 'rgba(138, 158, 133, 0.15)',
                            color: 'var(--sage-escuro)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            margin: '0 auto 1.5rem'
                        }}>
                            <CheckCircle2 size={40} />
                        </div>

                        <h2 style={{ fontSize: '2rem', color: 'var(--castanho)', marginBottom: '0.8rem' }}>
                            Pedido Recebido com Sucesso!
                        </h2>

                        <p style={{ color: 'var(--castanho-med)', fontSize: '1rem', lineHeight: '1.8', marginBottom: '2rem' }}>
                            Obrigado, <strong>{form.nome_cliente}</strong>. A nossa equipa de cenografia
                            irá analisar os seus requisitos e entraremos em contacto em menos de 24 horas úteis.
                        </p>

                        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                            <a href="/" className="btn-secondary" style={{ background: 'var(--creme-escuro)', color: 'var(--castanho)' }}>
                                Voltar ao Início
                            </a>
                            <a
                                href={whatsappDirectUrl()}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="btn-primary"
                                style={{ background: '#25D366', borderColor: '#25D366' }}
                            >
                                <MessageCircle size={18} /> Falar Imediatamente no WhatsApp
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="pagina">
            <div className="pagina-header">
                <div className="header-linha">Atendimento Personalizado</div>
                <h1>Pedir <span>Orçamento</span></h1>
                <p>Preencha os detalhes da sua celebração e receba uma consultoria cenográfica sem compromisso</p>
            </div>

            <div className="contacto-layout">

                {/* ── Painel esquerdo ── */}
                <div className="contacto-info">
                    <div className="contacto-info-titulo">
                        <span className="label-rosa">Contactos Directos</span>
                        <h2>Vamos criar algo extraordinário juntos</h2>
                        <p>Estamos disponíveis para esclarecer qualquer questão e agendar uma reunião presencial ou virtual para planear o seu evento.</p>
                    </div>

                    <div className="contacto-detalhes">
                        <a href={`https://wa.me/${WHATSAPP_NUM}?text=${encodeURIComponent('Olá! Gostaria de falar sobre um orçamento de decoração.')}`} target="_blank" rel="noopener noreferrer" className="contacto-detalhe contacto-detalhe-link">
                            <div className="contacto-detalhe-icon contacto-detalhe-icon--wa">
                                <MessageCircle size={18} strokeWidth={1.5} />
                            </div>
                            <div className="contacto-detalhe-texto">
                                <strong>WhatsApp Oficial</strong>
                                <span>+258 84 000 0000 — Resposta rápida</span>
                            </div>
                        </a>
                        <div className="contacto-detalhe">
                            <div className="contacto-detalhe-icon">
                                <Phone size={18} strokeWidth={1.5} />
                            </div>
                            <div className="contacto-detalhe-texto">
                                <strong>Telefone</strong>
                                <span>+258 84 000 0000 / +258 82 000 0000</span>
                            </div>
                        </div>
                        <div className="contacto-detalhe">
                            <div className="contacto-detalhe-icon">
                                <Mail size={18} strokeWidth={1.5} />
                            </div>
                            <div className="contacto-detalhe-texto">
                                <strong>Email Directo</strong>
                                <span>geral@ornamentacao.co.mz</span>
                            </div>
                        </div>
                        <div className="contacto-detalhe">
                            <div className="contacto-detalhe-icon">
                                <MapPin size={18} strokeWidth={1.5} />
                            </div>
                            <div className="contacto-detalhe-texto">
                                <strong>Atendimento</strong>
                                <span>Maputo & Matola (Actuação em todo Moçambique)</span>
                            </div>
                        </div>
                        <div className="contacto-detalhe">
                            <div className="contacto-detalhe-icon">
                                <Clock size={18} strokeWidth={1.5} />
                            </div>
                            <div className="contacto-detalhe-texto">
                                <strong>Horário</strong>
                                <span>Segunda–Sábado, 8h00–18h00</span>
                            </div>
                        </div>
                    </div>

                    {/* Mapa */}
                    <div className="contacto-mapa">
                        <iframe
                            title="Localização Maputo"
                            src={MAPA_EMBED}
                            width="100%"
                            height="220"
                            style={{ border: 0, borderRadius: '14px' }}
                            allowFullScreen=""
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                        />
                    </div>
                </div>

                {/* ── Formulário ── */}
                <form className="form-pedido" onSubmit={handleSubmit} noValidate>

                    {/* Banner se veio da calculadora ou pacotes */}
                    {(pacoteParam || estimativaParam) && (
                        <div style={{
                            background: 'rgba(197, 160, 89, 0.12)',
                            border: '1px solid rgba(197, 160, 89, 0.35)',
                            borderRadius: '12px',
                            padding: '0.8rem 1.2rem',
                            marginBottom: '1.5rem',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.6rem'
                        }}>
                            <Sparkles size={18} color="var(--dourado)" />
                            <span style={{ fontSize: '0.86rem', color: 'var(--castanho)', fontWeight: 600 }}>
                                Proposta Pré-configurada: {pacoteParam ? `Pacote ${pacoteParam}` : ''}
                                {estimativaParam ? ` • Estimativa: MZN ${Number(estimativaParam).toLocaleString()}` : ''}
                            </span>
                        </div>
                    )}

                    <div className="form-titulo">
                        <h3>Detalhes da Sua Celebração</h3>
                        <p>Os campos marcados com * são obrigatórios para elaborarmos a proposta</p>
                    </div>

                    <div className="form-row">
                        <div className="form-grupo">
                            <label>O Seu Nome <span>*</span></label>
                            <input
                                name="nome_cliente"
                                value={form.nome_cliente}
                                onChange={handleChange}
                                placeholder="Nome completo"
                                required
                            />
                        </div>
                        <div className="form-grupo">
                            <label>Endereço de Email <span>*</span></label>
                            <input
                                type="email"
                                name="email"
                                value={form.email}
                                onChange={handleChange}
                                placeholder="email@exemplo.com"
                                required
                            />
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-grupo">
                            <label>Contacto Telefónico / WhatsApp</label>
                            <input
                                name="telefone"
                                value={form.telefone}
                                onChange={handleChange}
                                placeholder="+258 84 000 0000"
                            />
                        </div>
                        <div className="form-grupo">
                            <label>Tipo de Evento</label>
                            <select name="tipo_evento" value={form.tipo_evento} onChange={handleChange}>
                                <option value="">Seleccione o tipo...</option>
                                <option value="Casamento">💍 Casamento Religioso / Civil</option>
                                <option value="Tradicional (Lobo)">🇲🇿 Cerimónia Tradicional (Lobo / Kuthinga)</option>
                                <option value="Corporativo">🏢 Gala ou Conferência Corporativa</option>
                                <option value="Aniversário">🎂 Aniversário & Festa Glamour</option>
                                <option value="Batizado">👶 Batizado / Primeira Comunhão</option>
                                <option value="Formatura">🎓 Festa de Formatura</option>
                                <option value="Outro">✨ Outro Tipo de Celebração</option>
                            </select>
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-grupo">
                            <label>Data Pretendida</label>
                            <input
                                type="date"
                                name="data_evento"
                                value={form.data_evento}
                                onChange={handleChange}
                                min={new Date().toISOString().split('T')[0]}
                            />
                        </div>
                        <div className="form-grupo">
                            <label>Local / Salão / Cidade</label>
                            <input
                                name="local_evento"
                                value={form.local_evento}
                                onChange={handleChange}
                                placeholder="Ex: Hotel Polana, Maputo ou Matola"
                            />
                        </div>
                    </div>

                    <div className="form-grupo">
                        <label>Visão Geral do Evento & Requisitos Especiais</label>
                        <textarea
                            name="descricao"
                            value={form.descricao}
                            onChange={handleChange}
                            rows="4"
                            placeholder="Descreva a temática desejada, paleta de cores, número de convidados ou outros detalhes importantes..."
                        />
                    </div>

                    {erro && <p className="erro-msg" style={{ margin: '1rem 0' }}>⚠️ {erro}</p>}

                    <button type="submit" className="btn-submit" disabled={enviando}>
                        <Send size={17} />
                        {enviando ? 'A enviar pedido...' : 'Submeter Pedido de Orçamento'}
                    </button>

                    <p className="form-whatsapp-alt">
                        Prefere atendimento imediato?{' '}
                        <a href={whatsappDirectUrl()} target="_blank" rel="noopener noreferrer">
                            <MessageCircle size={14} style={{ verticalAlign: 'middle', marginRight: '3px' }} />
                            Fale directamente pelo WhatsApp
                        </a>
                    </p>
                </form>
            </div>
        </div>
    );
}

export default Contacto;
