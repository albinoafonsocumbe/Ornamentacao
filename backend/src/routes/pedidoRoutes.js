const express                        = require('express');
const { body, validationResult }     = require('express-validator');
const ctrl                           = require('../controllers/pedidoController');
const { verificarToken }             = require('../middleware/auth');
const rateLimit                      = require('express-rate-limit');

const router = express.Router();

// Rate limit para criação de pedidos (anti-spam)
const limitadorPedidos = rateLimit({
    windowMs: 60 * 60 * 1000,
    max: 5,
    message: { sucesso: false, mensagem: 'Limite de pedidos por hora atingido. Tente mais tarde.' },
});

// Middleware de validação
const validarPedido = [
    body('nome_cliente')
        .trim()
        .notEmpty().withMessage('Nome é obrigatório.')
        .isLength({ max: 150 }).withMessage('Nome demasiado longo.'),
    body('email')
        .trim()
        .notEmpty().withMessage('Email é obrigatório.')
        .isEmail().withMessage('Email inválido.')
        .normalizeEmail(),
    body('telefone')
        .optional({ checkFalsy: true })
        .trim()
        .isLength({ max: 30 }).withMessage('Telefone inválido.'),
    body('data_evento')
        .optional({ checkFalsy: true })
        .isISO8601().withMessage('Data inválida.'),
    body('estimativa')
        .optional({ checkFalsy: true })
        .isNumeric().withMessage('Estimativa deve ser um número.'),
];

const tratarValidacao = (req, res, next) => {
    const erros = validationResult(req);
    if (!erros.isEmpty()) {
        return res.status(400).json({
            sucesso: false,
            mensagem: erros.array()[0].msg,
            erros: erros.array(),
        });
    }
    next();
};

// ── Rotas ────────────────────────────────────────
// Público
router.post('/', limitadorPedidos, validarPedido, tratarValidacao, ctrl.criarPedido);

// Admin (protegido)
router.get('/',                 verificarToken, ctrl.listarPedidos);
router.get('/estatisticas',     verificarToken, ctrl.estatisticas);
router.get('/:id',              verificarToken, ctrl.obterPorId);
router.patch('/:id/estado',     verificarToken, ctrl.actualizarEstado);
router.delete('/:id',           verificarToken, ctrl.eliminar);

module.exports = router;
