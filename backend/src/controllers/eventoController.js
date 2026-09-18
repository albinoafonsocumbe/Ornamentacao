const eventoModel = require('../models/eventoModel');

const listarEventos = async (req, res) => {
    try {
        const eventos = await eventoModel.listarEventos();

        res.status(200).json({
            sucesso: true,
            dados: eventos
        });

    } catch (erro) {
        console.error(erro);
        res.status(500).json({
            sucesso: false,
            mensagem: 'Erro ao obter os eventos.'
        });
    }
};

module.exports = { listarEventos };
