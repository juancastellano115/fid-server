const Usuario = require("../models/Usuario");
const bcrypt = require("bcryptjs");
const { validationResult} = require('express-validator');
const JWT = require('jsonwebtoken');

exports.crearUsuario = async (req, res) => {

    //revisar si hay errores
    const errores = validationResult(req);
    if (!errores.isEmpty()) {
        return res.status(400).json({errores: errores.array()})
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
            id: usuario.id
            
        }
    }
    JWT.sign(payload, process.env.SECRET,{
        expiresIn: '1h',
    },(error, token)=>{
        if (error) throw error
         //mensaje
        res.json({token});
    })

   
  } catch (error) {
    console.log(error);
    res.status(400).send("Error");
  }
};
