const express = require("express");
const articulosController = require("../controllers/articulosController");
const router = express.Router();
const auth = require("../middleware/auth");
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
  [check("nombre", "el nombre del articulo es obligatorio").not().isEmpty()],
  articulosController.crearArticulo
);

//obtener articulos del perfil que lo solicita (me)
//api/articulos GET
router.get("/", auth, articulosController.obtenerArticulos);

//obtener articulos segun ciudad (página principal)
router.get("/cities", auth, articulosController.obtenerArticulosByCity);

//actualizar articulos
router.put(
  "/:id",
  auth,
  [check("nombre", "el nombre del articulo es obligatorio").not().isEmpty()],
  articulosController.actualizarArticulo
);

//eliminar articulos
router.delete("/:id", auth, articulosController.eliminarArticulo);

module.exports = router;
