//rutas para autenticar
const express = require("express");
const router = express.Router();
const { check } = require("express-validator");
const authController = require('../controllers/authController');

//crear un usuario
//api/auth
router.post("/", [
    check('email','agrega un email válido').isEmail(),
    check('password','Debe ser min 6').isLength({min: 6})
],authController.autenticarUsuario);



module.exports = router;
