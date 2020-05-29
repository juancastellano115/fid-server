const Usuario = require("../models/Usuario");
const bcrypt = require("bcryptjs");
const { validationResult } = require("express-validator");
const JWT = require("jsonwebtoken");

exports.crearUsuario = async (req, res) => {
  //revisar si hay errores
  const errores = validationResult(req);
  if (!errores.isEmpty()) {
    return res.status(400).json({ errores: errores.array() });
  }
  //extraer mail y pass
  const { email, password } = req.body;

  try {
    let usuario = await Usuario.findOne({ email });
    //revisar que no exista
    if (usuario) {
      return res.status(400).json({ msg: "Ese usuario ya existe" });
    }

    //guardar el nuevo usuario
    usuario = new Usuario(req.body);

    //hashear el password
    const salt = await bcrypt.genSalt(10);
    usuario.password = await bcrypt.hash(password, salt);

    await usuario.save();
    //crear el JWT
    const payload = {
      usuario: {
        id: usuario.id,
        rol: usuario.rol
      },
    };
    JWT.sign(
      payload,
      process.env.SECRET,
      {
        expiresIn: "1h",
      },
      (error, token) => {
        if (error) throw error;
        //mensaje
        res.json({ token });
      }
    );
  } catch (error) {
    console.log(error);
    res.status(400).send("Error");
  }
};

exports.getUsuario = async (req, res) => {
  try {
    let usuario = await Usuario.findById(req.usuario.id);
    if (!usuario) {
      return res.status(400).json({ msg: "Ese usuario no existe" });
    }
    else {
      res.json({ data: usuario })
    }
  } catch (error) {
    console.log(error)
  }
};

exports.likes = async (req, res) => {
  try {
    //comprobar que no te das like a ti mismo
    if (req.usuario.id != req.params.id) {
      let usuarioLike = await Usuario.findById(req.params.id);
      let usuario = await Usuario.findById(req.usuario.id);
      usuarioLike.likes += 1;
      await usuarioLike.save()
      usuario.likesOtorgados.push(req.params.id)
      await usuario.save()
      return res.json({ msg: "like dado y registrado" });

    }
    else {
      return res.status(400).json({ msg: "No te puedes dar like a ti mismo" });
    }
  } catch (error) {
    console.log(error)
    return res.status(201).json({ msg: "Error en el server al dar like" });
  }
};

exports.editarPerfil = async (req, res) =>{
  
    //revisar si hay errores
  const errores = validationResult(req);
  if (!errores.isEmpty()) {
    return res.status(400).json({ errores: errores.array() });
  }
  const perfilEditado = {};

  if (req.file) {
    perfilEditado.foto = req.file.filename
  }
  if (req.body.nombre) {
    perfilEditado.nombre = req.body.nombre
  }
  if (req.body.password) {
    const salt = await bcrypt.genSalt(10);
    perfilEditado.password = await bcrypt.hash(req.body.password, salt);
  }
  if (req.body.email) {
    perfilEditado.email = req.body.email
  }
  if (req.body.ciudad && req.body.ciudad != "undefined") {
    perfilEditado.ciudad = req.body.ciudad
  }
  if (req.body.genero && req.body.genero != "undefined") {
    perfilEditado.genero = req.body.genero
  }

  try {
    //revisar el ID
    let usuario = await Usuario.findById(req.params.id);
    //usuario existe o no
    if (!usuario) {
      return res.status(404).json({ msg: "usuario no encontrado" });
    }
    //actualizar
    usuario = await Usuario.findOneAndUpdate(
      { _id: req.params.id },
      { $set: perfilEditado },
      { new: true }
    );
      
    res.json({ usuario });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Error del server al actualizar el perfil" });
  }
}

exports.borrarUsuario = async (req, res) => {
  try {
    //revisar el ID
    let user = await Usuario.findOneAndDelete({ email: req.body.email })
    if (user) {
      return res.json({ msg: 'Usuario borrado' })
    }
    return res.status(404).json({ msg: 'Usuario no encontrado' })
  } catch (error) {
    console.log(error);
    res.status(404).json({ msg: "error del server al borrar usuario" });
  }
}

exports.hacerAdmin = async (req, res) => {
  try {
    //revisar que exista
    let user = await Usuario.findOne({ email: req.body.email })
    if (user) {
      user.rol = 'ADMIN'
      await user.save()
      return res.json({ msg: 'Cambio satisfactorio' })
    }
    else {
      res.status(404).json({ msg: "Usuario no encontrado" });
    }
    
  } catch (error) {
    console.log(error);
    res.status(401).json({ msg: "error del server al borrar usuario" });
  }
}