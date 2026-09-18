import { useEffect, useState, useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Check, MessageCircle, Printer, Sparkles, Send } from 'lucide-react';
import api from '../services/api';
import { tarifasDefault } from '../data/fallbackData';
import './Calculadora.css';

const WHATSAPP_NUM = '258840000000';

function Calculadora() {
    const [searchParams] = useSearchParams();
    const pacoteParam = searchParams.get('pacote');

    const [tarifas, setTarifas] = useState(tarifasDefault);
    const [pacoteSel, setPacoteSel] = useState(() => {
        if (pacoteParam) {
            const num = Number(pacoteParam);
            return !isNaN(num) ? num : 2;
        }
        return 2; // Pacote Glamour pré-selecionado por padrão
    });
    const [extrasSel, setExtrasSel] = useState([4]); // Extra iluminação pré-selecionado para demonstração rica
    const [distancia, setDistancia] = useState(15);
    const [convidados, setConvidados] = useState(100);

    // Carregar da API se disponível
    useEffect(() => {
        api.get('/tarifas')
            .then(res => {
                if (res.data?.dados && Object.keys(res.data.dados).length > 0) {
                    setTarifas(res.data.dados);
                }
            })
            .catch(() => {});
    }, []);

    const toggleExtra = (id) => {
        setExtrasSel(prev =>
            prev.includes(id) ? prev.filter(e => e !== id) : [...prev, id]
        );
    };

    // Cálculo em tempo real (Instantâneo e fluido)
    const calculo = useMemo(() => {
        const pacoteAtual = (tarifas.pacote || []).find(p => p.id === pacoteSel) || tarifas.pacote?.[0];
        if (!pacoteAtual) return null;

        let total = parseFloat(pacoteAtual.valor) || 0;
        const detalhes = [
            { item: pacoteAtual.nome, valor: parseFloat(pacoteAtual.valor) || 0 }
        ];

        // Extras
        const extrasEscolhidos = (tarifas.extra || []).filter(e => extrasSel.includes(e.id));
        extrasEscolhidos.forEach(extra => {
            const v = parseFloat(extra.valor) || 0;
            total += v;
            detalhes.push({ item: extra.nome, valor: v });
        });

        // Deslocação
        if (distancia > 0) {
            let taxaDeslocacao = 0;
            let nomeDeslocacao = 'Deslocação (Maputo e arredores)';
            if (distancia <= 30) {
                taxaDeslocacao = 2000;
                nomeDeslocacao = `Deslocação até 30km (${distancia} km)`;
            } else if (distancia <= 60) {
                taxaDeslocacao = 4000;
                nomeDeslocacao = `Deslocação 30–60km (${distancia} km)`;
            } else {
                taxaDeslocacao = 8000;
                nomeDeslocacao = `Deslocação acima de 60km (${distancia} km)`;
            }
            total += taxaDeslocacao;
            detalhes.push({ item: nomeDeslocacao, valor: taxaDeslocacao });
        }

        // Acréscimo de convidados se > 100
        if (convidados > 100) {
            const grupos = Math.floor((convidados - 100) / 50);
            const percentual = grupos * 0.05;
            if (percentual > 0) {
                const acrescimo = total * percentual;
                total += acrescimo;
                detalhes.push({
                    item: `Acréscimo de escala (+${percentual * 100}% para ${convidados} pessoas)`,
                    valor: acrescimo
                });
            }
        }

        return {
            pacoteNome: pacoteAtual.nome,
            extrasNomes: extrasEscolhidos.map(e => e.nome),
            total,
            detalhes
        };
    }, [tarifas, pacoteSel, extrasSel, distancia, convidados]);

    // Mensagem formatada para WhatsApp
    const mensagemWhatsApp = useMemo(() => {
        if (!calculo) return '';
        const msg =
`✦ *Estimativa de Orçamento — Ornamentação* ✦

*Pacote Seleccionado:* ${calculo.pacoteNome}
*Convidados:* ${convidados} pessoas
*Distância aproximada:* ${distancia} km de Maputo
*Extras incluídos:*
${calculo.extrasNomes.length > 0 ? calculo.extrasNomes.map(e => ` • ${e}`).join('\n') : ' • Nenhum extra selecionado'}

*VALOR TOTAL ESTIMADO:* MZN ${calculo.total.toLocaleString('pt-MZ', { minimumFractionDigits: 2 })}

Olá! Gostaria de verificar a disponibilidade da minha data para este orçamento.`;

        return encodeURIComponent(msg);
    }, [calculo, convidados, distancia]);

    const urlContacto = useMemo(() => {
        if (!calculo) return '/contacto';
        return `/contacto?pacote=${encodeURIComponent(calculo.pacoteNome)}&estimativa=${calculo.total}&convidados=${convidados}&distancia=${distancia}`;
    }, [calculo, convidados, distancia]);

    return (
        <div className="calc-pagina">
            <div className="pagina-header">
                <div className="header-linha">Simulador Interativo</div>
                <h1>Calculadora de <span>Estimativa</span></h1>
                <p>Configure a cenografia e extras do seu evento e obtenha uma estimativa instantânea em Meticais (MZN)</p>
            </div>

            <div className="calc-container">
                {/* Coluna esquerda — formulário */}
                <div className="calc-form">

                    {/* Passo 1: Pacote */}
                    <div className="calc-secao">
                        <div className="calc-secao-titulo">
                            <span className="calc-num">1</span>
                            <div>
                                <h3>Escolha o Pacote Base</h3>
                                <p style={{ fontSize: '0.85rem', color: 'var(--castanho-suave)', margin: 0 }}>
                                    Seleccione a dimensão que melhor se adapta à sua ocasião
                                </p>
                            </div>
                        </div>
                        <div className="pacotes-opcoes">
                            {(tarifas.pacote || []).map(p => {
                                const activo = pacoteSel === p.id;
                                return (
                                    <div
                                        key={p.id}
                                        className={`pacote-opcao ${activo ? 'activo' : ''}`}
                                        onClick={() => setPacoteSel(p.id)}
                                        style={{
                                            borderWidth: activo ? '2px' : '1.5px',
                                            borderColor: activo ? 'var(--rosa)' : 'rgba(232, 212, 196, 0.7)',
                                            background: activo ? 'rgba(201, 133, 122, 0.05)' : '#ffffff'
                                        }}
                                    >
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                                            <div style={{
                                                width: '24px',
                                                height: '24px',
                                                borderRadius: '50%',
                                                border: activo ? 'none' : '2px solid rgba(201, 133, 122, 0.4)',
                                                background: activo ? 'var(--rosa)' : 'transparent',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                color: '#ffffff',
                                                flexShrink: 0
                                            }}>
                                                {activo && <Check size={14} strokeWidth={3} />}
                                            </div>
                                            <div>
                                                <h4 style={{ margin: '0 0 0.2rem', fontSize: '1.05rem', color: 'var(--castanho)' }}>
                                                    {p.nome}
                                                </h4>
                                                <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--castanho-suave)' }}>
                                                    {p.descricao}
                                                </p>
                                            </div>
                                        </div>
                                        <span className="opcao-preco" style={{ fontWeight: 700, color: 'var(--rosa-escuro)', whiteSpace: 'nowrap' }}>
                                            MZN {Number(p.valor).toLocaleString()}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Passo 2: Extras */}
                    <div className="calc-secao">
                        <div className="calc-secao-titulo">
                            <span className="calc-num">2</span>
                            <div>
                                <h3>Elementos Cenográficos Extras <span className="opcional">(opcional)</span></h3>
                                <p style={{ fontSize: '0.85rem', color: 'var(--castanho-suave)', margin: 0 }}>
                                    Enriqueça o seu evento com iluminação especial, pérgolas e detalhes luxuosos
                                </p>
                            </div>
                        </div>
                        <div className="extras-grid">
                            {(tarifas.extra || []).map(e => {
                                const activo = extrasSel.includes(e.id);
                                return (
                                    <label
                                        key={e.id}
                                        className={`extra-item ${activo ? 'activo' : ''}`}
                                        style={{
                                            cursor: 'pointer',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '0.8rem',
                                            padding: '0.9rem 1.2rem',
                                            borderRadius: '12px',
                                            border: `1.5px solid ${activo ? 'var(--rosa)' : 'rgba(232, 212, 196, 0.6)'}`,
                                            background: activo ? 'rgba(201, 133, 122, 0.05)' : '#ffffff',
                                            transition: 'all 0.2s ease'
                                        }}
                                    >
                                        <input
                                            type="checkbox"
                                            checked={activo}
                                            onChange={() => toggleExtra(e.id)}
                                            style={{ accentColor: 'var(--rosa)', width: '18px', height: '18px' }}
                                        />
                                        <div style={{ flex: 1 }}>
                                            <span className="extra-nome" style={{ display: 'block', fontWeight: 600, fontSize: '0.9rem', color: 'var(--castanho)' }}>
                                                {e.nome}
                                            </span>
                                            <span className="extra-preco" style={{ fontSize: '0.82rem', color: 'var(--rosa-escuro)', fontWeight: 700 }}>
                                                +MZN {Number(e.valor).toLocaleString()}
                                            </span>
                                        </div>
                                    </label>
                                );
                            })}
                        </div>
                    </div>

                    {/* Passo 3: Distância */}
                    <div className="calc-secao">
                        <div className="calc-secao-titulo">
                            <span className="calc-num">3</span>
                            <div>
                                <h3>Distância do Local do Evento</h3>
                                <p style={{ fontSize: '0.85rem', color: 'var(--castanho-suave)', margin: 0 }}>
                                    Logística de transporte e equipa a partir de Maputo Centro
                                </p>
                            </div>
                        </div>
                        <div className="slider-wrap">
                            <input
                                type="range"
                                min="0"
                                max="120"
                                step="5"
                                value={distancia}
                                onChange={e => setDistancia(Number(e.target.value))}
                                className="slider"
                            />
                            <div className="slider-labels">
                                <span>0 km (Maputo Centro)</span>
                                <strong>{distancia} km</strong>
                                <span>120 km</span>
                            </div>
                            <div className="slider-info">
                                {distancia === 0 ? '✓ Maputo Centro: Deslocação Gratuita' :
                                 distancia <= 30 ? `+ MZN 2.000 (Zona Metropolitana de Maputo & Matola — ${distancia} km)` :
                                 distancia <= 60 ? `+ MZN 4.000 (Boane, Marracuene, Bobole — ${distancia} km)` :
                                 `+ MZN 8.000 (Distritos e províncias vizinhas — ${distancia} km)`}
                            </div>
                        </div>
                    </div>

                    {/* Passo 4: Convidados */}
                    <div className="calc-secao">
                        <div className="calc-secao-titulo">
                            <span className="calc-num">4</span>
                            <div>
                                <h3>Número Estimado de Convidados</h3>
                                <p style={{ fontSize: '0.85rem', color: 'var(--castanho-suave)', margin: 0 }}>
                                    Dimensionamento de centros de mesa e toalhas
                                </p>
                            </div>
                        </div>
                        <div className="slider-wrap">
                            <input
                                type="range"
                                min="20"
                                max="400"
                                step="10"
                                value={convidados}
                                onChange={e => setConvidados(Number(e.target.value))}
                                className="slider"
                            />
                            <div className="slider-labels">
                                <span>20 convidados</span>
                                <strong>{convidados} convidados</strong>
                                <span>400 convidados</span>
                            </div>
                            {convidados > 100 ? (
                                <p className="slider-info">
                                    Acréscimo de escala proporcional aplicado (+{Math.floor((convidados - 100) / 50) * 5}% para estrutura acima de 100 convidados)
                                </p>
                            ) : (
                                <p className="slider-info" style={{ color: 'var(--sage-escuro)', background: 'rgba(138,158,133,0.1)', borderColor: 'rgba(138,158,133,0.3)' }}>
                                    ✓ Coberto integralmente na base do pacote
                                </p>
                            )}
                        </div>
                    </div>

                </div>

                {/* Coluna direita — resumo instantâneo */}
                <div className="calc-resultado-wrap">
                    {calculo && (
                        <div className="calc-resultado">
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                                <Sparkles size={20} color="var(--dourado)" />
                                <span className="badge-luxo">Estimativa em Tempo Real</span>
                            </div>

                            <h3>Resumo do Orçamento</h3>

                            <div className="resultado-detalhes">
                                {calculo.detalhes.map((d, i) => (
                                    <div key={i} className="resultado-linha">
                                        <span>{d.item}</span>
                                        <span>MZN {Number(d.valor).toLocaleString('pt-MZ', { minimumFractionDigits: 2 })}</span>
                                    </div>
                                ))}
                            </div>

                            <div className="resultado-total">
                                <div>
                                    <span>Total Estimado</span>
                                    <p style={{ fontSize: '0.75rem', color: 'var(--castanho-suave)', margin: 0 }}>
                                        IVA e assessoria incluídos
                                    </p>
                                </div>
                                <strong>MZN {Number(calculo.total).toLocaleString('pt-MZ', { minimumFractionDigits: 2 })}</strong>
                            </div>

                            <p className="resultado-nota">
                                * Estimativa indicativa para planeamento inicial. Os valores finais são confirmados após reunião de briefing.
                            </p>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                                <Link to={urlContacto} className="btn-orcamento">
                                    <Send size={16} /> Pedir Proposta Formal com estes Dados
                                </Link>

                                <a
                                    href={`https://wa.me/${WHATSAPP_NUM}?text=${mensagemWhatsApp}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="btn-whatsapp-sucesso"
                                    style={{ width: '100%', justifyContent: 'center', padding: '0.85rem' }}
                                >
                                    <MessageCircle size={18} /> Enviar Estimativa pelo WhatsApp
                                </a>

                                <button
                                    onClick={() => window.print()}
                                    style={{
                                        background: 'transparent',
                                        border: '1px solid rgba(232, 212, 196, 0.8)',
                                        color: 'var(--castanho-suave)',
                                        padding: '0.6rem',
                                        borderRadius: '25px',
                                        fontSize: '0.82rem',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        gap: '0.4rem'
                                    }}
                                >
                                    <Printer size={14} /> Imprimir Resumo
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Calculadora;
