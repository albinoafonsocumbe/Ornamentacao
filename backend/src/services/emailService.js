const nodemailer = require('nodemailer');

// ── Transporter ─────────────────────────────────
const criarTransporter = () => nodemailer.createTransport({
    host:   process.env.EMAIL_HOST   || 'smtp.gmail.com',
    port:   Number(process.env.EMAIL_PORT) || 587,
    secure: process.env.EMAIL_SECURE === 'true',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

// ── Estilo base partilhado ───────────────────────
const estiloBase = `
    <style>
        * { margin:0; padding:0; box-sizing:border-box; }
        body { font-family:'Segoe UI',Arial,sans-serif; background:#f4f0eb; color:#3a2820; }
        .wrapper { max-width:600px; margin:0 auto; padding:2rem 1rem; }
        .card { background:#ffffff; border-radius:16px; overflow:hidden; box-shadow:0 4px 24px rgba(45,31,26,0.1); }
        .header { background:linear-gradient(135deg,#2d1f1a,#5c3d2e); padding:2rem; text-align:center; }
        .header h1 { color:#e8b4ae; font-size:1.6rem; margin-bottom:0.3rem; }
        .header p  { color:rgba(249,244,239,0.6); font-size:0.85rem; letter-spacing:2px; text-transform:uppercase; }
        .body  { padding:2rem; }
        .body h2 { color:#2d1f1a; font-size:1.2rem; margin-bottom:1rem; }
        .body p  { color:#5c3d2e; line-height:1.7; margin-bottom:0.8rem; font-size:0.95rem; }
        .info-box { background:#f9f4ef; border:1px solid #e8d5c4; border-radius:10px; padding:1.2rem; margin:1.2rem 0; }
        .info-row { display:flex; justify-content:space-between; padding:0.5rem 0; border-bottom:1px solid #f0e4d4; font-size:0.9rem; }
        .info-row:last-child { border-bottom:none; }
        .info-row .label { color:#8b6555; font-weight:600; }
        .info-row .valor { color:#2d1f1a; }
        .badge { display:inline-block; padding:0.3rem 0.9rem; border-radius:20px; font-size:0.8rem; font-weight:600; }
        .badge-pendente   { background:#fef3cd; color:#856404; }
        .badge-em_analise { background:#cfe2ff; color:#084298; }
        .badge-aprovado   { background:#d1e7dd; color:#0a3622; }
        .badge-recusado   { background:#f8d7da; color:#842029; }
        .badge-concluido  { background:#e2d9f3; color:#432874; }
        .btn { display:inline-block; background:linear-gradient(135deg,#c9857a,#a86059); color:#ffffff !important; padding:0.8rem 2rem; border-radius:50px; text-decoration:none; font-weight:700; font-size:0.9rem; margin:1rem 0; }
        .footer { background:#f9f4ef; padding:1.2rem 2rem; text-align:center; border-top:1px solid #f0e4d4; }
        .footer p { color:#b5926e; font-size:0.78rem; line-height:1.6; }
        .logo { color:#c9857a; font-size:1rem; font-weight:700; }
    </style>
`;

// ── Template: confirmação ao cliente ─────────────
const templateConfirmacaoCliente = (pedido) => `
<!DOCTYPE html><html lang="pt"><head><meta charset="UTF-8">${estiloBase}</head>
<body><div class="wrapper"><div class="card">
    <div class="header">
        <h1>✦ Ornamentação</h1>
        <p>Confirmação de Pedido</p>
    </div>
    <div class="body">
        <h2>Olá, ${pedido.nome_cliente}! 🎉</h2>
        <p>O seu pedido de orçamento foi recebido com sucesso. A nossa equipa irá analisá-lo e entrará em contacto brevemente.</p>
        <div class="info-box">
            <div class="info-row"><span class="label">Referência</span><span class="valor">#${pedido.id}</span></div>
            ${pedido.tipo_evento ? `<div class="info-row"><span class="label">Tipo de Evento</span><span class="valor">${pedido.tipo_evento}</span></div>` : ''}
            ${pedido.data_evento ? `<div class="info-row"><span class="label">Data do Evento</span><span class="valor">${new Date(pedido.data_evento).toLocaleDateString('pt-MZ')}</span></div>` : ''}
            ${pedido.local_evento ? `<div class="info-row"><span class="label">Local</span><span class="valor">${pedido.local_evento}</span></div>` : ''}
            ${pedido.estimativa ? `<div class="info-row"><span class="label">Estimativa</span><span class="valor">MZN ${Number(pedido.estimativa).toLocaleString()}</span></div>` : ''}
            <div class="info-row"><span class="label">Estado</span><span class="valor"><span class="badge badge-pendente">Pendente</span></span></div>
        </div>
        <p>Enquanto isso, pode contactar-nos directamente pelo WhatsApp ou telefone se tiver alguma dúvida.</p>
        <center><a href="https://wa.me/${process.env.WHATSAPP_NUMBER || '258840000000'}?text=Olá,%20tenho%20o%20pedido%20%23${pedido.id}" class="btn">Falar pelo WhatsApp</a></center>
    </div>
    <div class="footer">
        <p class="logo">✦ Ornamentação</p>
        <p>Maputo, Moçambique &bull; ${process.env.EMAIL_USER || 'geral@ornamentacao.co.mz'}<br>
        Este email foi enviado automaticamente. Por favor não responda directamente.</p>
    </div>
</div></div></body></html>
`;

// ── Template: notificação ao admin ───────────────
const templateNotificacaoAdmin = (pedido) => `
<!DOCTYPE html><html lang="pt"><head><meta charset="UTF-8">${estiloBase}</head>
<body><div class="wrapper"><div class="card">
    <div class="header">
        <h1>✦ Novo Pedido</h1>
        <p>Plataforma de Ornamentação</p>
    </div>
    <div class="body">
        <h2>Novo pedido recebido! 📋</h2>
        <p>Um novo pedido de orçamento foi submetido através do website.</p>
        <div class="info-box">
            <div class="info-row"><span class="label">Referência</span><span class="valor">#${pedido.id}</span></div>
            <div class="info-row"><span class="label">Cliente</span><span class="valor">${pedido.nome_cliente}</span></div>
            <div class="info-row"><span class="label">Email</span><span class="valor">${pedido.email}</span></div>
            ${pedido.telefone ? `<div class="info-row"><span class="label">Telefone</span><span class="valor">${pedido.telefone}</span></div>` : ''}
            ${pedido.tipo_evento ? `<div class="info-row"><span class="label">Tipo de Evento</span><span class="valor">${pedido.tipo_evento}</span></div>` : ''}
            ${pedido.data_evento ? `<div class="info-row"><span class="label">Data do Evento</span><span class="valor">${new Date(pedido.data_evento).toLocaleDateString('pt-MZ')}</span></div>` : ''}
            ${pedido.local_evento ? `<div class="info-row"><span class="label">Local</span><span class="valor">${pedido.local_evento}</span></div>` : ''}
            ${pedido.estimativa ? `<div class="info-row"><span class="label">Estimativa</span><span class="valor">MZN ${Number(pedido.estimativa).toLocaleString()}</span></div>` : ''}
        </div>
        ${pedido.descricao ? `<p><strong>Descrição:</strong> ${pedido.descricao}</p>` : ''}
        <center><a href="${process.env.ADMIN_URL || 'http://localhost:3001'}/admin/pedidos" class="btn">Ver no Painel Admin</a></center>
    </div>
    <div class="footer">
        <p>Recebido em ${new Date().toLocaleString('pt-MZ')} &bull; Plataforma Ornamentação</p>
    </div>
</div></div></body></html>
`;

// ── Template: actualização de estado ─────────────
const labelEstado = {
    pendente:   'Pendente',
    em_analise: 'Em Análise',
    aprovado:   'Aprovado ✅',
    recusado:   'Recusado',
    concluido:  'Concluído 🎉',
};

const mensagemEstado = {
    em_analise: 'O seu pedido está a ser analisado pela nossa equipa. Entraremos em contacto em breve.',
    aprovado:   'Excelente notícia! O seu pedido foi aprovado. A nossa equipa irá contactá-lo para confirmar todos os detalhes do evento.',
    recusado:   'Infelizmente não nos foi possível avançar com o seu pedido neste momento. Contacte-nos para mais informações.',
    concluido:  'O seu evento foi realizado com sucesso! Obrigado por confiar em nós. Esperamos ter superado as suas expectativas.',
};

const templateActualizacaoEstado = (pedido) => `
<!DOCTYPE html><html lang="pt"><head><meta charset="UTF-8">${estiloBase}</head>
<body><div class="wrapper"><div class="card">
    <div class="header">
        <h1>✦ Ornamentação</h1>
        <p>Actualização do seu Pedido</p>
    </div>
    <div class="body">
        <h2>Olá, ${pedido.nome_cliente}!</h2>
        <p>O estado do seu pedido foi actualizado.</p>
        <div class="info-box">
            <div class="info-row"><span class="label">Referência</span><span class="valor">#${pedido.id}</span></div>
            <div class="info-row"><span class="label">Novo Estado</span><span class="valor"><span class="badge badge-${pedido.estado}">${labelEstado[pedido.estado] || pedido.estado}</span></span></div>
        </div>
        <p>${mensagemEstado[pedido.estado] || 'O seu pedido foi actualizado.'}</p>
        ${pedido.notas_admin ? `<div class="info-box"><p><strong>Nota da equipa:</strong> ${pedido.notas_admin}</p></div>` : ''}
        <center><a href="https://wa.me/${process.env.WHATSAPP_NUMBER || '258840000000'}?text=Olá,%20tenho%20uma%20dúvida%20sobre%20o%20pedido%20%23${pedido.id}" class="btn">Falar connosco</a></center>
    </div>
    <div class="footer">
        <p class="logo">✦ Ornamentação</p>
        <p>Maputo, Moçambique &bull; ${process.env.EMAIL_USER || 'geral@ornamentacao.co.mz'}</p>
    </div>
</div></div></body></html>
`;

// ── Funções públicas ─────────────────────────────
const enviarConfirmacaoCliente = async (pedido) => {
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
        console.log('[Email] Credenciais não configuradas — email não enviado.');
        return;
    }
    try {
        const transport = criarTransporter();
        await transport.sendMail({
            from:    `"✦ Ornamentação" <${process.env.EMAIL_USER}>`,
            to:      pedido.email,
            subject: `Pedido #${pedido.id} recebido — Ornamentação`,
            html:    templateConfirmacaoCliente(pedido),
        });
        console.log(`[Email] Confirmação enviada para ${pedido.email}`);
    } catch (erro) {
        console.error('[Email] Erro ao enviar confirmação:', erro.message);
    }
};

const enviarNotificacaoAdmin = async (pedido) => {
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) return;
    try {
        const transport = criarTransporter();
        await transport.sendMail({
            from:    `"✦ Ornamentação" <${process.env.EMAIL_USER}>`,
            to:      process.env.EMAIL_ADMIN || process.env.EMAIL_USER,
            subject: `[ADMIN] Novo pedido #${pedido.id} — ${pedido.nome_cliente}`,
            html:    templateNotificacaoAdmin(pedido),
        });
        console.log('[Email] Notificação admin enviada.');
    } catch (erro) {
        console.error('[Email] Erro ao notificar admin:', erro.message);
    }
};

const enviarActualizacaoEstado = async (pedido) => {
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) return;
    // Só enviar para estados relevantes para o cliente
    const estadosNotificar = ['em_analise', 'aprovado', 'recusado', 'concluido'];
    if (!estadosNotificar.includes(pedido.estado)) return;
    try {
        const transport = criarTransporter();
        await transport.sendMail({
            from:    `"✦ Ornamentação" <${process.env.EMAIL_USER}>`,
            to:      pedido.email,
            subject: `Pedido #${pedido.id} — Estado actualizado: ${labelEstado[pedido.estado]}`,
            html:    templateActualizacaoEstado(pedido),
        });
        console.log(`[Email] Actualização de estado enviada para ${pedido.email}`);
    } catch (erro) {
        console.error('[Email] Erro ao enviar actualização:', erro.message);
    }
};

module.exports = {
    enviarConfirmacaoCliente,
    enviarNotificacaoAdmin,
    enviarActualizacaoEstado,
};
