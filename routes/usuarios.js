//rutas para clos usuarios
const express = require("express");
const router = express.Router();
const usuarioController = require("../controllers/usuarioController");
const { check } = require("express-validator");
//crear un usuario
router.post("/", [
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('email','agrega un email válido').isEmail(),
    check('password','Debe ser min 6').isLength({min: 6})
], usuarioController.crearUsuario);
module.exports = router;
