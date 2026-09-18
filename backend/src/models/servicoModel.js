const pool = require('../config/database');

// ── Público ──────────────────────────────────────
const listarServicos = async () => {
    const r = await pool.query(
        `SELECT id, nome, descricao, preco_base, imagem, ativo
         FROM servicos WHERE ativo = TRUE ORDER BY id DESC`
    );
    return r.rows;
};

// ── Admin ─────────────────────────────────────────
const listarTodos = async () => {
    const r = await pool.query(
        `SELECT id, nome, descricao, preco_base, imagem, ativo, criado_em
         FROM servicos ORDER BY id DESC`
    );
    return r.rows;
};

const obterPorId = async (id) => {
    const r = await pool.query('SELECT * FROM servicos WHERE id = $1', [id]);
    return r.rows[0] || null;
};

const criar = async ({ nome, descricao, preco_base, imagem }) => {
    const r = await pool.query(
        `INSERT INTO servicos (nome, descricao, preco_base, imagem)
         VALUES ($1, $2, $3, $4) RETURNING *`,
        [nome, descricao || null, preco_base || 0, imagem || null]
    );
    return r.rows[0];
};

const actualizar = async (id, { nome, descricao, preco_base, imagem, ativo }) => {
    const r = await pool.query(
        `UPDATE servicos SET nome=$1, descricao=$2, preco_base=$3, imagem=$4, ativo=$5
         WHERE id=$6 RETURNING *`,
        [nome, descricao || null, preco_base || 0, imagem || null, ativo ?? true, id]
    );
    return r.rows[0] || null;
};

const eliminar = async (id) => {
    await pool.query('DELETE FROM servicos WHERE id = $1', [id]);
};

module.exports = { listarServicos, listarTodos, obterPorId, criar, actualizar, eliminar };
