const pool = require('../config/database');

// ── Público ──────────────────────────────────────
const listarPacotes = async () => {
    const r = await pool.query(
        `SELECT id, nome, descricao, preco_base, ativo
         FROM pacotes WHERE ativo = TRUE ORDER BY preco_base ASC`
    );
    return r.rows;
};

// ── Admin ─────────────────────────────────────────
const listarTodos = async () => {
    const r = await pool.query(
        `SELECT id, nome, descricao, preco_base, ativo, criado_em
         FROM pacotes ORDER BY preco_base ASC`
    );
    return r.rows;
};

const obterPorId = async (id) => {
    const r = await pool.query('SELECT * FROM pacotes WHERE id = $1', [id]);
    return r.rows[0] || null;
};

const criar = async ({ nome, descricao, preco_base }) => {
    const r = await pool.query(
        `INSERT INTO pacotes (nome, descricao, preco_base)
         VALUES ($1, $2, $3) RETURNING *`,
        [nome, descricao || null, preco_base || 0]
    );
    return r.rows[0];
};

const actualizar = async (id, { nome, descricao, preco_base, ativo }) => {
    const r = await pool.query(
        `UPDATE pacotes SET nome=$1, descricao=$2, preco_base=$3, ativo=$4
         WHERE id=$5 RETURNING *`,
        [nome, descricao || null, preco_base || 0, ativo ?? true, id]
    );
    return r.rows[0] || null;
};

const eliminar = async (id) => {
    await pool.query('DELETE FROM pacotes WHERE id = $1', [id]);
};

module.exports = { listarPacotes, listarTodos, obterPorId, criar, actualizar, eliminar };
