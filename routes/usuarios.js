//rutas para los usuarios
const express = require("express");
const router = express.Router();
const usuarioController = require("../controllers/usuarioController");
const { check } = require("express-validator");
const auth = require("../middleware/auth");
const adminCheck = require("../middleware/adminCheck");
const multer = require("multer");
const multerConf = require("../config/multerConf");
const upload = multer({
  storage: multerConf.multerStorage,
  fileFilter: multerConf.multerFilter,
});
//crear un usuario
router.post(
  "/",
  [
    check("nombre", "El nombre es obligatorio").not().isEmpty(),
    check("email", "agrega un email válido").isEmail(),
    check("password", "Debe ser min 6").isLength({ min: 6 }),
  ],
  usuarioController.crearUsuario
);
//dar la información de un usuario
router.get("/me", auth, usuarioController.getUsuario);

//endpoint para dar un like a un usuario
router.get("/like/:id", auth, usuarioController.likes);

//borrar un usuario (admin)
router.post("/admin/borrar", auth, adminCheck, usuarioController.borrarUsuario);

//hacer admin un usuario
router.post("/admin/make", auth, adminCheck, usuarioController.hacerAdmin);

//actualizar un usuario
router.post("/update/:id", auth, upload.single("file"), [check("email", "agrega un email válido").isEmail(),] , usuarioController.editarPerfil);
module.exports = router;