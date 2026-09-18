const servicoModel = require('../models/servicoModel');

// ── Público ──────────────────────────────────────
const listarServicos = async (req, res) => {
    try {
        const dados = await servicoModel.listarServicos();
        res.status(200).json({ sucesso: true, dados });
    } catch (erro) {
        console.error(erro);
        res.status(500).json({ sucesso: false, mensagem: 'Erro ao obter serviços.' });
    }
};

// ── Admin ─────────────────────────────────────────
const listarTodos = async (req, res) => {
    try {
        const dados = await servicoModel.listarTodos();
        res.status(200).json({ sucesso: true, dados });
    } catch (erro) {
        console.error(erro);
        res.status(500).json({ sucesso: false, mensagem: 'Erro ao obter serviços.' });
    }
};

const obterPorId = async (req, res) => {
    try {
        const dado = await servicoModel.obterPorId(req.params.id);
        if (!dado) return res.status(404).json({ sucesso: false, mensagem: 'Serviço não encontrado.' });
        res.status(200).json({ sucesso: true, dados: dado });
    } catch (erro) {
        console.error(erro);
        res.status(500).json({ sucesso: false, mensagem: 'Erro ao obter serviço.' });
    }
};

const criar = async (req, res) => {
    const { nome, descricao, preco_base, imagem } = req.body;
    if (!nome) return res.status(400).json({ sucesso: false, mensagem: 'Nome é obrigatório.' });
    try {
        const dado = await servicoModel.criar({ nome, descricao, preco_base, imagem });
        res.status(201).json({ sucesso: true, mensagem: 'Serviço criado.', dados: dado });
    } catch (erro) {
        console.error(erro);
        res.status(500).json({ sucesso: false, mensagem: 'Erro ao criar serviço.' });
    }
};

const actualizar = async (req, res) => {
    try {
        const dado = await servicoModel.actualizar(req.params.id, req.body);
        if (!dado) return res.status(404).json({ sucesso: false, mensagem: 'Serviço não encontrado.' });
        res.status(200).json({ sucesso: true, mensagem: 'Serviço actualizado.', dados: dado });
    } catch (erro) {
        console.error(erro);
        res.status(500).json({ sucesso: false, mensagem: 'Erro ao actualizar serviço.' });
    }
};

const eliminar = async (req, res) => {
    try {
        await servicoModel.eliminar(req.params.id);
        res.status(200).json({ sucesso: true, mensagem: 'Serviço eliminado.' });
    } catch (erro) {
        console.error(erro);
        res.status(500).json({ sucesso: false, mensagem: 'Erro ao eliminar serviço.' });
    }
};

module.exports = { listarServicos, listarTodos, obterPorId, criar, actualizar, eliminar };
