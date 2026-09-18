const pacoteModel = require('../models/pacoteModel');

// ── Público ──────────────────────────────────────
const listarPacotes = async (req, res) => {
    try {
        const dados = await pacoteModel.listarPacotes();
        res.status(200).json({ sucesso: true, dados });
    } catch (erro) {
        console.error(erro);
        res.status(500).json({ sucesso: false, mensagem: 'Erro ao obter pacotes.' });
    }
};

// ── Admin ─────────────────────────────────────────
const listarTodos = async (req, res) => {
    try {
        const dados = await pacoteModel.listarTodos();
        res.status(200).json({ sucesso: true, dados });
    } catch (erro) {
        console.error(erro);
        res.status(500).json({ sucesso: false, mensagem: 'Erro ao obter pacotes.' });
    }
};

const obterPorId = async (req, res) => {
    try {
        const dado = await pacoteModel.obterPorId(req.params.id);
        if (!dado) return res.status(404).json({ sucesso: false, mensagem: 'Pacote não encontrado.' });
        res.status(200).json({ sucesso: true, dados: dado });
    } catch (erro) {
        console.error(erro);
        res.status(500).json({ sucesso: false, mensagem: 'Erro ao obter pacote.' });
    }
};

const criar = async (req, res) => {
    const { nome, descricao, preco_base } = req.body;
    if (!nome) return res.status(400).json({ sucesso: false, mensagem: 'Nome é obrigatório.' });
    try {
        const dado = await pacoteModel.criar({ nome, descricao, preco_base });
        res.status(201).json({ sucesso: true, mensagem: 'Pacote criado.', dados: dado });
    } catch (erro) {
        console.error(erro);
        res.status(500).json({ sucesso: false, mensagem: 'Erro ao criar pacote.' });
    }
};

const actualizar = async (req, res) => {
    try {
        const dado = await pacoteModel.actualizar(req.params.id, req.body);
        if (!dado) return res.status(404).json({ sucesso: false, mensagem: 'Pacote não encontrado.' });
        res.status(200).json({ sucesso: true, mensagem: 'Pacote actualizado.', dados: dado });
    } catch (erro) {
        console.error(erro);
        res.status(500).json({ sucesso: false, mensagem: 'Erro ao actualizar pacote.' });
    }
};

const eliminar = async (req, res) => {
    try {
        await pacoteModel.eliminar(req.params.id);
        res.status(200).json({ sucesso: true, mensagem: 'Pacote eliminado.' });
    } catch (erro) {
        console.error(erro);
        res.status(500).json({ sucesso: false, mensagem: 'Erro ao eliminar pacote.' });
    }
};

module.exports = { listarPacotes, listarTodos, obterPorId, criar, actualizar, eliminar };
