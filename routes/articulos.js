const express = require("express");
const articulosController = require("../controllers/articulosController");
const router = express.Router();
const auth = require("../middleware/auth");
const adminCheck = require("../middleware/adminCheck");
const { check } = require("express-validator");
const multer = require("multer");
const multerConf = require('../config/multerConfProducts')
const upload = multer({
  storage: multerConf.multerStorage,
  fileFilter: multerConf.multerFilter,
});
//crea un articulo
//api/articulos
router.post(
  "/",
  auth,
  upload.array("fotos", 5),
  [check("nombre", "el nombre del articulo es obligatorio").not().isEmpty(),
  check("desc", "la descripcción del articulo es obligatorio").not().isEmpty(),
  check("precio", "el precio del articulo es obligatorio").not().isEmpty()],
  articulosController.crearArticulo
);

//obtener articulos del perfil que lo solicita
//api/articulos GET
router.get("/", auth, articulosController.obtenerArticulos);

//obtener articulos segun ciudad y query(página principal)
router.get("/search", auth, articulosController.obtenerArticulosByCity);

//actualizar articulos
router.put(
  "/:id",
  auth,
  upload.array("fotos", 5),
  [check("nombre", "el nombre del articulo es obligatorio").not().isEmpty(),
  check("desc", "la descripcción del articulo es obligatorio").not().isEmpty(),
  check("precio", "el precio del articulo es obligatorio").isNumeric().not().isEmpty()],
  articulosController.actualizarArticulo
);

//eliminar articulos
router.delete("/:id", auth, articulosController.eliminarArticulo);

//obtener un articulo concreto
router.get('/:id',auth,articulosController.obtenerArticulo)

//obtener articulos por email (admin)
router.post('/admin/articulosByEmail',auth,adminCheck, articulosController.getArticulosPorEmail)
module.exports = router;
