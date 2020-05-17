const Usuario = require("../models/Usuario");
const bcrypt = require("bcryptjs");
const { validationResult} = require('express-validator');
const JWT = require('jsonwebtoken');


exports.autenticarUsuario = async(req,res)=> {
  //revisar si hay errores
  const errores = validationResult(req);
  if (!errores.isEmpty()) {
      return res.status(400).json({errores: errores.array()})
  }

  //extraer mail y pass
  const {email, password} = req.body
  try {
      // Revisar que está registrado
      let usuario = await Usuario.findOne({email});
      if (!usuario) {
          return res.status(400).json({msg: 'Ese usuario no existe'})
      }
      //revisar el pass
      const passCorrecto = await bcrypt.compare(password, usuario.password)
      if (!passCorrecto) {
          return res.status(400).json({msg: 'Password incorrecto'})
      }
      //si todo es correcto
      //crear el JWT
      const payload = {
        usuario: {
            id: usuario.id,
            rol: usuario.rol
        }
    }
    JWT.sign(payload, process.env.SECRET,{
        expiresIn: '3h',
    },(error, token)=>{
        if (error) throw error
         //mensaje
        res.json({token});
    })

   
  } catch (error) {
      console.log(error)
  }
}