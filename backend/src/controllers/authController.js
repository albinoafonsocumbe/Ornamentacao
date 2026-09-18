const bcrypt   = require('bcryptjs');
const jwt      = require('jsonwebtoken');
const authModel = require('../models/authModel');

const login = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({
            sucesso: false,
            mensagem: 'Email e password são obrigatórios.'
        });
    }

    try {
        const admin = await authModel.encontrarPorEmail(email);

        if (!admin) {
            return res.status(401).json({
                sucesso: false,
                mensagem: 'Credenciais inválidas.'
            });
        }

        const passwordValida = await bcrypt.compare(password, admin.password);

        if (!passwordValida) {
            return res.status(401).json({
                sucesso: false,
                mensagem: 'Credenciais inválidas.'
            });
        }

        const token = jwt.sign(
            { id: admin.id, email: admin.email, nome: admin.nome },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN || '8h' }
        );

        res.status(200).json({
            sucesso: true,
            mensagem: 'Login efectuado com sucesso.',
            token,
            admin: {
                id:    admin.id,
                nome:  admin.nome,
                email: admin.email
            }
        });

    } catch (erro) {
        console.error(erro);
        res.status(500).json({
            sucesso: false,
            mensagem: 'Erro interno ao efectuar login.'
        });
    }
};

const perfil = async (req, res) => {
    try {
        const admin = await authModel.encontrarPorId(req.admin.id);
        if (!admin) {
            return res.status(404).json({ sucesso: false, mensagem: 'Admin não encontrado.' });
        }
        res.status(200).json({ sucesso: true, dados: admin });
    } catch (erro) {
        console.error(erro);
        res.status(500).json({ sucesso: false, mensagem: 'Erro interno.' });
    }
};

module.exports = { login, perfil };
