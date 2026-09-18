const express = require('express');
const ctrl = require('../controllers/servicoController');
const { verificarToken } = require('../middleware/auth');

const router = express.Router();

// Público
router.get('/', ctrl.listarServicos);

// Admin (protegido)
router.get('/admin/todos',   verificarToken, ctrl.listarTodos);
router.get('/admin/:id',     verificarToken, ctrl.obterPorId);
router.post('/admin',        verificarToken, ctrl.criar);
router.put('/admin/:id',     verificarToken, ctrl.actualizar);
router.delete('/admin/:id',  verificarToken, ctrl.eliminar);

module.exports = router;
