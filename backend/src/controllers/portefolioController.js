const portefolioModel = require('../models/portefolioModel');
const path  = require('path');
const fs    = require('fs');

// ── Público ──────────────────────────────────────
const listarPortefolio = async (req, res) => {
    try {
        const { categoria } = req.query;
        const dados = await portefolioModel.listarPortefolio(categoria || null);
        res.status(200).json({ sucesso: true, dados });
    } catch (erro) {
        console.error(erro);
        res.status(500).json({ sucesso: false, mensagem: 'Erro ao obter portefólio.' });
    }
};

const listarCategorias = async (req, res) => {
    try {
        const dados = await portefolioModel.listarCategorias();
        res.status(200).json({ sucesso: true, dados });
    } catch (erro) {
        console.error(erro);
        res.status(500).json({ sucesso: false, mensagem: 'Erro ao obter categorias.' });
    }
};

// ── Admin ─────────────────────────────────────────
const listarTodos = async (req, res) => {
    try {
        const dados = await portefolioModel.listarTodos();
        res.status(200).json({ sucesso: true, dados });
    } catch (erro) {
        console.error(erro);
        res.status(500).json({ sucesso: false, mensagem: 'Erro ao obter portefólio.' });
    }
};

const obterPorId = async (req, res) => {
    try {
        const dado = await portefolioModel.obterPorId(req.params.id);
        if (!dado) return res.status(404).json({ sucesso: false, mensagem: 'Item não encontrado.' });
        res.status(200).json({ sucesso: true, dados: dado });
    } catch (erro) {
        console.error(erro);
        res.status(500).json({ sucesso: false, mensagem: 'Erro ao obter item.' });
    }
};

const criar = async (req, res) => {
    const { titulo, descricao, categoria } = req.body;
    if (!titulo) return res.status(400).json({ sucesso: false, mensagem: 'Título é obrigatório.' });
    if (!req.file) return res.status(400).json({ sucesso: false, mensagem: 'Imagem é obrigatória.' });

    const imagem = `/uploads/${req.file.filename}`;
    try {
        const dado = await portefolioModel.criarItem({ titulo, descricao, imagem, categoria });
        res.status(201).json({ sucesso: true, mensagem: 'Item criado.', dados: dado });
    } catch (erro) {
        console.error(erro);
        res.status(500).json({ sucesso: false, mensagem: 'Erro ao criar item.' });
    }
};

const actualizar = async (req, res) => {
    try {
        const { titulo, descricao, categoria, ativo } = req.body;
        const atual = await portefolioModel.obterPorId(req.params.id);
        if (!atual) return res.status(404).json({ sucesso: false, mensagem: 'Item não encontrado.' });

        // Se foi enviada nova imagem, usar a nova; caso contrário manter a existente
        const imagem = req.file ? `/uploads/${req.file.filename}` : atual.imagem;

        const dado = await portefolioModel.actualizar(req.params.id, {
            titulo, descricao, imagem, categoria, ativo: ativo === 'true' || ativo === true
        });
        res.status(200).json({ sucesso: true, mensagem: 'Item actualizado.', dados: dado });
    } catch (erro) {
        console.error(erro);
        res.status(500).json({ sucesso: false, mensagem: 'Erro ao actualizar item.' });
    }
};

const eliminar = async (req, res) => {
    try {
        const item = await portefolioModel.obterPorId(req.params.id);
        if (item && item.imagem) {
            const filePath = path.join(__dirname, '../../uploads', path.basename(item.imagem));
            if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
        }
        await portefolioModel.eliminar(req.params.id);
        res.status(200).json({ sucesso: true, mensagem: 'Item eliminado.' });
    } catch (erro) {
        console.error(erro);
        res.status(500).json({ sucesso: false, mensagem: 'Erro ao eliminar item.' });
    }
};

module.exports = { listarPortefolio, listarCategorias, listarTodos, obterPorId, criar, actualizar, eliminar };
