const pool = require('../config/database');

const encontrarPorEmail = async (email) => {
    const resultado = await pool.query(
        'SELECT * FROM admins WHERE email = $1',
        [email]
    );
    return resultado.rows[0] || null;
};

const encontrarPorId = async (id) => {
    const resultado = await pool.query(
        'SELECT id, nome, email FROM admins WHERE id = $1',
        [id]
    );
    return resultado.rows[0] || null;
};

module.exports = { encontrarPorEmail, encontrarPorId };
