const mongoose = require("mongoose");
const roles = {
  values: ['ADMIN', 'USER'],
  message: '{VALUE} no es un rol válido'
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
  Ciudad: String,
  rol: { type: String, default: 'USER', enum: roles },
});

module.exports = mongoose.model("Usuario", UsuariosSchema);
