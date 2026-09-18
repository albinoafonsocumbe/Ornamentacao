const pool = require('../config/database');

// ── Público ──────────────────────────────────────
const criarPedido = async ({ nome_cliente, email, telefone, tipo_evento, data_evento, local_evento, descricao, estimativa }) => {
    const r = await pool.query(
        `INSERT INTO pedidos (nome_cliente, email, telefone, tipo_evento, data_evento, local_evento, descricao, estimativa)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *`,
        [nome_cliente, email, telefone || null, tipo_evento || null, data_evento || null, local_evento || null, descricao || null, estimativa || null]
    );
    return r.rows[0];
};

const listarPedidos = async () => {
    const r = await pool.query(
        `SELECT id, nome_cliente, email, telefone, tipo_evento, data_evento, local_evento, estimativa, estado, criado_em
         FROM pedidos ORDER BY criado_em DESC`
    );
    return r.rows;
};

// ── Admin ─────────────────────────────────────────
const obterPorId = async (id) => {
    const r = await pool.query('SELECT * FROM pedidos WHERE id = $1', [id]);
    return r.rows[0] || null;
};

const actualizarEstado = async (id, { estado, notas_admin }) => {
    const r = await pool.query(
        `UPDATE pedidos SET estado=$1, notas_admin=$2 WHERE id=$3 RETURNING *`,
        [estado, notas_admin || null, id]
    );
    return r.rows[0] || null;
};

const eliminar = async (id) => {
    await pool.query('DELETE FROM pedidos WHERE id = $1', [id]);
};

const estatisticas = async () => {
    const r = await pool.query(
        `SELECT
            COUNT(*) AS total,
            COUNT(*) FILTER (WHERE estado = 'pendente')    AS pendentes,
            COUNT(*) FILTER (WHERE estado = 'em_analise')  AS em_analise,
            COUNT(*) FILTER (WHERE estado = 'aprovado')    AS aprovados,
            COUNT(*) FILTER (WHERE estado = 'concluido')   AS concluidos,
            COUNT(*) FILTER (WHERE estado = 'recusado')    AS recusados
         FROM pedidos`
    );
    return r.rows[0];
};

module.exports = { criarPedido, listarPedidos, obterPorId, actualizarEstado, eliminar, estatisticas };
