const pedidoModel  = require('../models/pedidoModel');
const emailService = require('../services/emailService');

// ── Público ──────────────────────────────────────
const criarPedido = async (req, res) => {
    const { nome_cliente, email, telefone, tipo_evento, data_evento, local_evento, descricao, estimativa } = req.body;

    if (!nome_cliente || !email) {
        return res.status(400).json({ sucesso: false, mensagem: 'Nome e email são obrigatórios.' });
    }

    try {
        const pedido = await pedidoModel.criarPedido({
            nome_cliente, email, telefone, tipo_evento,
            data_evento, local_evento, descricao, estimativa
        });

        // Emails em background — não bloquear a resposta
        emailService.enviarConfirmacaoCliente(pedido);
        emailService.enviarNotificacaoAdmin(pedido);

        res.status(201).json({
            sucesso: true,
            mensagem: 'Pedido criado com sucesso.',
            dados: pedido
        });
    } catch (erro) {
        console.error(erro);
        res.status(500).json({ sucesso: false, mensagem: 'Erro ao criar pedido.' });
    }
};

const listarPedidos = async (req, res) => {
    try {
        const dados = await pedidoModel.listarPedidos();
        res.status(200).json({ sucesso: true, dados });
    } catch (erro) {
        console.error(erro);
        res.status(500).json({ sucesso: false, mensagem: 'Erro ao obter pedidos.' });
    }
};

// ── Admin ─────────────────────────────────────────
const obterPorId = async (req, res) => {
    try {
        const dado = await pedidoModel.obterPorId(req.params.id);
        if (!dado) return res.status(404).json({ sucesso: false, mensagem: 'Pedido não encontrado.' });
        res.status(200).json({ sucesso: true, dados: dado });
    } catch (erro) {
        console.error(erro);
        res.status(500).json({ sucesso: false, mensagem: 'Erro ao obter pedido.' });
    }
};

const actualizarEstado = async (req, res) => {
    const { estado, notas_admin } = req.body;
    const estadosValidos = ['pendente', 'em_analise', 'aprovado', 'recusado', 'concluido'];

    if (!estadosValidos.includes(estado)) {
        return res.status(400).json({ sucesso: false, mensagem: 'Estado inválido.' });
    }

    try {
        const pedido = await pedidoModel.actualizarEstado(req.params.id, { estado, notas_admin });
        if (!pedido) return res.status(404).json({ sucesso: false, mensagem: 'Pedido não encontrado.' });

        // Notificar cliente por email
        emailService.enviarActualizacaoEstado(pedido);

        res.status(200).json({ sucesso: true, mensagem: 'Estado actualizado.', dados: pedido });
    } catch (erro) {
        console.error(erro);
        res.status(500).json({ sucesso: false, mensagem: 'Erro ao actualizar estado.' });
    }
};

const eliminar = async (req, res) => {
    try {
        await pedidoModel.eliminar(req.params.id);
        res.status(200).json({ sucesso: true, mensagem: 'Pedido eliminado.' });
    } catch (erro) {
        console.error(erro);
        res.status(500).json({ sucesso: false, mensagem: 'Erro ao eliminar pedido.' });
    }
};

const estatisticas = async (req, res) => {
    try {
        const dados = await pedidoModel.estatisticas();
        res.status(200).json({ sucesso: true, dados });
    } catch (erro) {
        console.error(erro);
        res.status(500).json({ sucesso: false, mensagem: 'Erro ao obter estatísticas.' });
    }
};

module.exports = { criarPedido, listarPedidos, obterPorId, actualizarEstado, eliminar, estatisticas };
