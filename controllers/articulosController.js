const Articulo = require("../models/Articulo");
const Usuario = require("../models/Usuario");
const { validationResult } = require("express-validator");
exports.crearArticulo = async (req, res) => {
  //revisar si hay errores
  const errores = validationResult(req);
  if (!errores.isEmpty()) {
    return res.status(400).json({ errores: errores.array() });
  }

  try {
    //crear un nuevo articulo
    const articulo = new Articulo(req.body);
    articulo.creador = req.usuario.id;
    let fotos = [];
    for (const iterator of req.files) {
      fotos.push(iterator.filename);
    }
    articulo.fotos = fotos;
    articulo.save();
    res.json(articulo);
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "hubo un error creando el artículo" });
  }
};

//obtiene todos los articulos de un usuario

exports.obtenerArticulos = async (req, res) => {
  try {
    const articulos = await Articulo.find({ creador: req.id }).sort({
      fecha: -1,
    });
    res.json(articulos);
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "hubo un error al obtener los articulos" });
  }
};

//obtiene todos los articulos de una ciudad
exports.obtenerArticulosByCity = async (req, res) => {
  let articulos = null;
  if (req.query.city) {
    try {
      usuario = await Usuario.findById(req.usuario.id);
      usuario.ciudad = req.query.city;
      await usuario.save();
      if (req.query.search) {
        articulos = await Articulo.find({
          ciudad: req.query.city,
          nombre:{ $regex : req.query.search, $options: 'i' },
        })
          .sort({
            fecha: -1,
          })
          .skip(req.query.skip)
          .limit(10);
      } else {
        articulos = await Articulo.find({ ciudad: req.query.city })
          .sort({
            fecha: -1,
          })
          .skip(req.query.skip)
          .limit(10);
      }
      return res.json(articulos);
    } catch (error) {
      console.log(error);
      res
        .status(500)
        .json({ msg: "hubo un error al obtener los articulos por ciudad" });
    }
  } else {
    try {
      if (req.query.search) {
        articulos = await Articulo.find({
          nombre:{ $regex : req.query.search, $options: 'i' },
        })
          .sort({
            fecha: -1,
          })
          .skip(req.query.skip)
          .limit(10);
      } else {
        articulos = await Articulo.find()
        .sort({
          fecha: -1,
        })
        .skip(Number.parseInt(req.query.skip))
        .limit(10);
      }
      return  res.json(articulos); 
    } catch (error) {
      console.log(error);
      res.status(500).json({ msg: "hubo un error al obtener los articulos" });
    }
  }
};

//actualizar un articulo
exports.actualizarArticulo = async (req, res) => {
  //revisar si hay errores
  const errores = validationResult(req);
  if (!errores.isEmpty()) {
    return res.status(400).json({ errores: errores.array() });
  }
  //extraer la info del articulo

  const { nombre } = req.body;
  const nuevoArticulo = {};
  if (nombre) {
    nuevoArticulo.nombre = nombre;
  }
  try {
    //revisar el ID
    let articulo = await Articulo.findById(req.params.id);
    //articulo existe o no
    if (!articulo) {
      return res.status(404).json({ msg: "articulo no encontrado" });
    }
    //verificar creador
    if (articulo.creador.toString() !== req.usuario.id) {
      return res.status(401).json({ msg: "No autorizado" });
    }
    //actualizar
    articulo = await Articulo.findOneAndUpdate(
      { _id: req.params.id },
      { $set: nuevoArticulo },
      { new: true }
    );
    res.json({ articulo });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "error del server al actualizar producto" });
  }
};

//eliminar un articulo
exports.eliminarArticulo = async (req, res) => {
  try {
    //revisar el ID
    let articulo = await Articulo.findById(req.params.id);
    //articulo existe o no
    if (!articulo) {
      return res.status(404).json({ msg: "articulo no encontrado" });
    }
    //verificar creador
    if (articulo.creador.toString() !== req.usuario.id) {
      return res.status(401).json({ msg: "No autorizado" });
    }
    //eliminar el articulo
    await Articulo.findOneAndRemove({ _id: req.params.id });
    res.json({ msg: "Artículo eliminado" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "error del server al eliminar producto" });
  }
};

//obtiene un articulo concreto y su dueño
exports.obtenerArticulo = async (req, res) => {
  try {
    //revisar el ID
    let articulo = await Articulo.findById(req.params.id);
    //articulo existe o no
    if (!articulo) {
      return res.status(404).json({ msg: "articulo no encontrado" });
    }
    //coger el dueño del articulo para mostrar su perfil
    let propietario = await Usuario.findById(articulo.creador);
    let objetoDatos = {articulo, propietario};
    res.json(objetoDatos)
  } catch (error) {
    console.log(error);
    res.status(404).json({ msg: "error del server al buscar producto" });
  }
};