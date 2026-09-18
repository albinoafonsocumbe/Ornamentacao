const pool = require('../config/database');

// ── Público ──────────────────────────────────────
const listarPortefolio = async (categoria = null) => {
    let query = `SELECT id, titulo, descricao, imagem, categoria, criado_em FROM portefolio WHERE ativo = TRUE`;
    const params = [];
    if (categoria) { query += ` AND categoria = $1`; params.push(categoria); }
    query += ` ORDER BY id DESC`;
    const r = await pool.query(query, params);
    return r.rows;
};

const listarCategorias = async () => {
    const r = await pool.query(
        `SELECT DISTINCT categoria FROM portefolio WHERE categoria IS NOT NULL AND ativo = TRUE ORDER BY categoria ASC`
    );
    return r.rows.map(row => row.categoria);
};

const criarItem = async ({ titulo, descricao, imagem, categoria }) => {
    const r = await pool.query(
        `INSERT INTO portefolio (titulo, descricao, imagem, categoria) VALUES ($1,$2,$3,$4) RETURNING *`,
        [titulo, descricao || null, imagem, categoria || null]
    );
    return r.rows[0];
};

// ── Admin ─────────────────────────────────────────
const listarTodos = async () => {
    const r = await pool.query(
        `SELECT id, titulo, descricao, imagem, categoria, ativo, criado_em FROM portefolio ORDER BY id DESC`
    );
    return r.rows;
};

const obterPorId = async (id) => {
    const r = await pool.query('SELECT * FROM portefolio WHERE id = $1', [id]);
    return r.rows[0] || null;
};

const actualizar = async (id, { titulo, descricao, imagem, categoria, ativo }) => {
    const r = await pool.query(
        `UPDATE portefolio SET titulo=$1, descricao=$2, imagem=$3, categoria=$4, ativo=$5 WHERE id=$6 RETURNING *`,
        [titulo, descricao || null, imagem, categoria || null, ativo ?? true, id]
    );
    return r.rows[0] || null;
};

const eliminar = async (id) => {
    await pool.query('DELETE FROM portefolio WHERE id = $1', [id]);
};

module.exports = { listarPortefolio, listarCategorias, criarItem, listarTodos, obterPorId, actualizar, eliminar };
