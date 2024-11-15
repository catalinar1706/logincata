// const express = require('express');
// const router = express.Router();
// const usuarioController = require('../controllers/usarioControllers.js');

// router.post('/registrar',usuarioController.registrarUsuario)
// router.post('/login',usuarioController.loginUsuario)
// router.get('/autenticar',usuarioController.autenticarToken)

// module.exports = router;


const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/usarioControllers.js');

// Ruta para registrar un usuario
router.post('/registrar', usuarioController.registrarUsuario);

// Ruta para iniciar sesión
router.post('/login', usuarioController.loginUsuario);

// Ruta protegida para autenticar el token
router.get('/autenticar', usuarioController.autenticarToken, (req, res) => {
    res.status(200).json({ mensaje: 'Token válido', usuario: req.user });
});

module.exports = router;
