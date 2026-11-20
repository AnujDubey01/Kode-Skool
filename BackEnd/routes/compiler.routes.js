const express = require('express');
const router = express.Router();
const compilerController = require('../controllers/compiler.controller');

// POST /api/compiler/execute
router.post('/execute', compilerController.execute);

module.exports = router;
