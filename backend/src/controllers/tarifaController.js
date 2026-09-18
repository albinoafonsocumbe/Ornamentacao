const tarifaModel = require('../models/tarifaModel');

// ── Público ──────────────────────────────────────
const listarTarifas = async (req, res) => {
    try {
        const tarifas = await tarifaModel.listarTarifas();
        const agrupadas = tarifas.reduce((acc, t) => {
            if (!acc[t.tipo]) acc[t.tipo] = [];
            acc[t.tipo].push(t);
            return acc;
        }, {});
        res.status(200).json({ sucesso: true, dados: agrupadas });
    } catch (erro) {
        console.error(erro);
        res.status(500).json({ sucesso: false, mensagem: 'Erro ao obter tarifas.' });
    }
};

const calcularEstimativa = async (req, res) => {
    const { pacote_id, extras_ids, distancia_km, num_convidados } = req.body;
    if (!pacote_id) return res.status(400).json({ sucesso: false, mensagem: 'Seleccione um pacote.' });
    try {
        const resultado = await tarifaModel.calcularEstimativa({
            pacote_id, extras_ids: extras_ids || [],
            distancia_km: distancia_km || 0,
            num_convidados: num_convidados || 50
        });
        res.status(200).json({ sucesso: true, dados: resultado });
    } catch (erro) {
        console.error(erro);
        res.status(500).json({ sucesso: false, mensagem: 'Erro ao calcular estimativa.' });
    }
};

// ── Admin ─────────────────────────────────────────
const listarTodos = async (req, res) => {
    try {
        const dados = await tarifaModel.listarTodos();
        res.status(200).json({ sucesso: true, dados });
    } catch (erro) {
        console.error(erro);
        res.status(500).json({ sucesso: false, mensagem: 'Erro ao obter tarifas.' });
    }
};

const obterPorId = async (req, res) => {
    try {
        const dado = await tarifaModel.obterPorId(req.params.id);
        if (!dado) return res.status(404).json({ sucesso: false, mensagem: 'Tarifa não encontrada.' });
        res.status(200).json({ sucesso: true, dados: dado });
    } catch (erro) {
        console.error(erro);
        res.status(500).json({ sucesso: false, mensagem: 'Erro ao obter tarifa.' });
    }
};

const criar = async (req, res) => {
    const { nome, descricao, tipo, valor } = req.body;
    if (!nome || !tipo) return res.status(400).json({ sucesso: false, mensagem: 'Nome e tipo são obrigatórios.' });
    try {
        const dado = await tarifaModel.criar({ nome, descricao, tipo, valor });
        res.status(201).json({ sucesso: true, mensagem: 'Tarifa criada.', dados: dado });
    } catch (erro) {
        console.error(erro);
        res.status(500).json({ sucesso: false, mensagem: 'Erro ao criar tarifa.' });
    }
};

const actualizar = async (req, res) => {
    try {
        const dado = await tarifaModel.actualizar(req.params.id, req.body);
        if (!dado) return res.status(404).json({ sucesso: false, mensagem: 'Tarifa não encontrada.' });
        res.status(200).json({ sucesso: true, mensagem: 'Tarifa actualizada.', dados: dado });
    } catch (erro) {
        console.error(erro);
        res.status(500).json({ sucesso: false, mensagem: 'Erro ao actualizar tarifa.' });
    }
};

const eliminar = async (req, res) => {
    try {
        await tarifaModel.eliminar(req.params.id);
        res.status(200).json({ sucesso: true, mensagem: 'Tarifa eliminada.' });
    } catch (erro) {
        console.error(erro);
        res.status(500).json({ sucesso: false, mensagem: 'Erro ao eliminar tarifa.' });
    }
};

module.exports = { listarTarifas, calcularEstimativa, listarTodos, obterPorId, criar, actualizar, eliminar };
