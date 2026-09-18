const pool = require('../config/database');

const listarEventos = async () => {
    const resultado = await pool.query(`
        SELECT id, nome, descricao, imagem, ativo
        FROM eventos
        WHERE ativo = TRUE
        ORDER BY id DESC
    `);
    return resultado.rows;
};

module.exports = { listarEventos };
