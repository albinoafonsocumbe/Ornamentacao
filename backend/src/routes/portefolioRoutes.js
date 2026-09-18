const express = require('express');
const ctrl = require('../controllers/portefolioController');
const { verificarToken } = require('../middleware/auth');
const upload = require('../config/upload');

const router = express.Router();

// Público
router.get('/',           ctrl.listarPortefolio);
router.get('/categorias', ctrl.listarCategorias);

// Admin (protegido)
router.get('/admin/todos',            verificarToken, ctrl.listarTodos);
router.get('/admin/:id',              verificarToken, ctrl.obterPorId);
router.post('/admin',                 verificarToken, upload.single('imagem'), ctrl.criar);
router.put('/admin/:id',              verificarToken, upload.single('imagem'), ctrl.actualizar);
router.delete('/admin/:id',           verificarToken, ctrl.eliminar);

module.exports = router;
