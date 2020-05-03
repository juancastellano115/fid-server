const mongoose = require("mongoose");
const roles = {
  values: ['ADMIN', 'USER'],
  message: '{VALUE} no es un rol válido'
}
const generos = {
  values: ['Hombre', 'Mujer'],
  message: '{VALUE} no es un genero válido'
}

const UsuariosSchema = mongoose.Schema({
  nombre: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  registro: {
    type: Date,
    default: Date.now(),
  },
  likes: {
    type: Number,
    default: 0,
  },
  likesOtorgados : Array,
  foto : String,
  ciudad: String,
  genero: { type: String, enum: generos },
  rol: { type: String, default: 'USER', enum: roles },
});

UsuariosSchema.methods.toJSON = function() {
  var obj = this.toObject();
  delete obj.password;
  return obj;
 }

module.exports = mongoose.model("Usuario", UsuariosSchema);
