const express = require('express');
const eventoController = require('../controllers/eventoController');

const router = express.Router();

router.get('/', eventoController.listarEventos);

module.exports = router;
