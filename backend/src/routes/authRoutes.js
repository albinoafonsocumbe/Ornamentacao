const express                    = require('express');
const { body, validationResult } = require('express-validator');
const authController             = require('../controllers/authController');
const { verificarToken }         = require('../middleware/auth');

const router = express.Router();

const validarLogin = [
    body('email').trim().isEmail().withMessage('Email inválido.').normalizeEmail(),
    body('password').notEmpty().withMessage('Password é obrigatória.'),
];

const tratarValidacao = (req, res, next) => {
    const erros = validationResult(req);
    if (!erros.isEmpty()) {
        return res.status(400).json({ sucesso: false, mensagem: erros.array()[0].msg });
    }
    next();
};

router.post('/login',  validarLogin, tratarValidacao, authController.login);
router.get('/perfil',  verificarToken, authController.perfil);

module.exports = router;
