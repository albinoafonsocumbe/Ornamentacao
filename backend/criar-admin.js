/**
 * Script para criar ou repor o admin padrão na base de dados.
 * Executa com: node criar-admin.js
 */
require('dotenv').config();
const bcrypt = require('bcryptjs');
const pool   = require('./src/config/database');

async function criarAdmin() {
    const nome     = 'Administrador';
    const email    = 'admin@ornamentacao.mz';
    const password = 'Admin@2024';

    try {
        // Criar tabela se não existir
        await pool.query(`
            CREATE TABLE IF NOT EXISTS admins (
                id        SERIAL PRIMARY KEY,
                nome      VARCHAR(100) NOT NULL,
                email     VARCHAR(150) UNIQUE NOT NULL,
                password  VARCHAR(255) NOT NULL,
                criado_em TIMESTAMP DEFAULT NOW()
            )
        `);

        // Gerar hash
        const hash = await bcrypt.hash(password, 10);
        console.log('Hash gerado:', hash);

        // Inserir ou actualizar
        await pool.query(`
            INSERT INTO admins (nome, email, password)
            VALUES ($1, $2, $3)
            ON CONFLICT (email)
            DO UPDATE SET password = $3
        `, [nome, email, hash]);

        console.log('');
        console.log('✅ Admin criado/actualizado com sucesso!');
        console.log('   Email:    ', email);
        console.log('   Password: ', password);
        console.log('');

    } catch (erro) {
        console.error('❌ Erro:', erro.message);
    } finally {
        await pool.end();
    }
}

criarAdmin();
