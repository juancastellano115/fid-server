const mongoose = require("mongoose");
const ArticuloSchema = mongoose.Schema({
    nombre:{
        type:String,
        required: true,
    },
    creador: {
        type: mongoose.Schema.Types.ObjectId,
        ref:'Usuario'
    },
    fecha:{
        type: Date,
        default: Date.now()
    },
    alergenos:{
        type: Array,
        required: true
    },
    desc:{
        type: String,
    },
    ciudad:{
        type: String,
    },
    precio:{
        type: Number,
        required:true
    },
    alergenos:{
        type: Array,
    },
    fotos: Array
})
module.exports = mongoose.model('Articulo', ArticuloSchema)