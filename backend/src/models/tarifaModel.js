const pool = require('../config/database');

// ── Público ──────────────────────────────────────
const listarTarifas = async () => {
    const r = await pool.query(
        `SELECT id, nome, tipo, valor, descricao FROM tarifas WHERE ativo = TRUE ORDER BY tipo, valor ASC`
    );
    return r.rows;
};

const calcularEstimativa = async ({ pacote_id, extras_ids, distancia_km, num_convidados }) => {
    let total = 0;
    const detalhes = [];

    // Pacote base
    if (pacote_id) {
        const res = await pool.query(
            `SELECT nome, valor FROM tarifas WHERE id = $1 AND tipo = 'pacote'`, [pacote_id]
        );
        if (res.rows.length > 0) {
            const v = parseFloat(res.rows[0].valor);
            total += v;
            detalhes.push({ item: res.rows[0].nome, valor: v });
        }
    }

    // Extras
    if (extras_ids && extras_ids.length > 0) {
        const res = await pool.query(
            `SELECT nome, valor FROM tarifas WHERE id = ANY($1) AND tipo = 'extra'`, [extras_ids]
        );
        res.rows.forEach(row => {
            const v = parseFloat(row.valor);
            total += v;
            detalhes.push({ item: row.nome, valor: v });
        });
    }

    // Deslocação
    if (distancia_km > 0) {
        let nomeDeslocacao;
        if      (distancia_km <= 30) nomeDeslocacao = 'Deslocacao ate 30km';
        else if (distancia_km <= 60) nomeDeslocacao = 'Deslocacao 30-60km';
        else                         nomeDeslocacao = 'Deslocacao acima 60km';

        const res = await pool.query(
            `SELECT nome, valor FROM tarifas WHERE nome = $1`, [nomeDeslocacao]
        );
        if (res.rows.length > 0) {
            const v = parseFloat(res.rows[0].valor);
            total += v;
            detalhes.push({ item: res.rows[0].nome, valor: v });
        }
    }

    // Acréscimo por convidados
    if (num_convidados > 100) {
        const grupos = Math.floor((num_convidados - 100) / 50);
        const acrescimo = total * (grupos * 0.05);
        if (acrescimo > 0) {
            total += acrescimo;
            detalhes.push({ item: `Acréscimo ${grupos * 5}% (${num_convidados} convidados)`, valor: acrescimo });
        }
    }

    return { total, detalhes };
};

// ── Admin ─────────────────────────────────────────
const listarTodos = async () => {
    const r = await pool.query(
        `SELECT id, nome, tipo, valor, descricao, ativo, criado_em FROM tarifas ORDER BY tipo, valor ASC`
    );
    return r.rows;
};

const obterPorId = async (id) => {
    const r = await pool.query('SELECT * FROM tarifas WHERE id = $1', [id]);
    return r.rows[0] || null;
};

const criar = async ({ nome, descricao, tipo, valor }) => {
    const r = await pool.query(
        `INSERT INTO tarifas (nome, descricao, tipo, valor) VALUES ($1,$2,$3,$4) RETURNING *`,
        [nome, descricao || null, tipo, valor || 0]
    );
    return r.rows[0];
};

const actualizar = async (id, { nome, descricao, tipo, valor, ativo }) => {
    const r = await pool.query(
        `UPDATE tarifas SET nome=$1, descricao=$2, tipo=$3, valor=$4, ativo=$5 WHERE id=$6 RETURNING *`,
        [nome, descricao || null, tipo, valor || 0, ativo ?? true, id]
    );
    return r.rows[0] || null;
};

const eliminar = async (id) => {
    await pool.query('DELETE FROM tarifas WHERE id = $1', [id]);
};

module.exports = { listarTarifas, calcularEstimativa, listarTodos, obterPorId, criar, actualizar, eliminar };
