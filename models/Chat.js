const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const MessageSchema = new Schema({
    message: {
        type: String
    },
    sender: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario', required: true
    },
    receiver: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        required: true
    },
    seen: {
        type: Boolean,
        default: false,
      },
},{ timestamps: true});


module.exports = mongoose.model("Chat", MessageSchema);