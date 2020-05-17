//rutas para clos usuarios
const express = require("express");
const router = express.Router();
const usuarioController = require("../controllers/usuarioController");
const { check } = require("express-validator");
const auth = require('../middleware/auth');
//crear un usuario
router.post("/", [
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('email','agrega un email válido').isEmail(),
    check('password','Debe ser min 6').isLength({min: 6})
], usuarioController.crearUsuario);
//dar la información de un usuario
router.get('/me',auth,usuarioController.getUsuario);

//endpoint para dar un like a un usuario
router.get('/like/:id', auth, usuarioController.likes)

module.exports = router;