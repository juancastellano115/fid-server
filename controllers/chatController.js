const ChatMessages = require("../models/Chat");
const Usuario = require("../models/Usuario");
const mongoose = require('mongoose');


exports.getMessages = (req, res) => {
  ChatMessages.find({
    sender: { $in: [req.body.sender, req.body.receiver] },
    receiver: { $in: [req.body.sender, req.body.receiver] },
  })
    .populate("receiver", "nombre foto")
    .exec((err, data) => {
      if (err) {
        console.log("Error", err);
        res.send({ message: err });
      } else {
        res.json({ message: data });
      }
    });
};

exports.get_conversations = async (req, res) => {
  try {
    const users = await Usuario.findById(req.usuario.id).populate(
      "chats",
      "_id nombre foto"
    );
    // obtener los chats del usuario
    const lastMessages = await ChatMessages.aggregate([
      {
        $match: {
          $or: [
            {
              receiver: mongoose.Types.ObjectId(req.usuario.id),
            },
            {
              sender: mongoose.Types.ObjectId(req.usuario.id),
            },
          ],
        },
      },
      {
        $sort: { createdAt: -1 },
      },
      {
        $group: {
          _id: "$receiver",
          doc: {
            $first: "$$ROOT",
          },
        },
      },
      { $replaceRoot: { newRoot: "$doc" } },
    ]);

    const conversations = [];

    users.chats.map((u) => {
      const user = {
        id: u.id,
        nombre: u.nombre,
        foto: u.foto,
      };

      const sender = lastMessages.find((m) => u.id === m.sender.toString());
      if (sender) {
        user.seen = sender.seen;
        user.lastMessageCreatedAt = sender.createdAt;
        user.lastMessage = sender.message;
        user.lastMessageSender = false;
      } else {
        const receiver = lastMessages.find(
          (m) => u.id === m.receiver.toString()
        );

        if (receiver) {
          user.seen = receiver.seen;
          user.lastMessageCreatedAt = receiver.createdAt;
          user.lastMessage = receiver.message;
          user.lastMessageSender = true;
        }
      }

      conversations.push(user);
    });
    // ordenar los usuarios por fecha
    
    const sortedConversations = conversations.sort((a, b) =>
      b.lastMessageCreatedAt.toString().localeCompare(a.lastMessageCreatedAt)
    );

    res.json(sortedConversations);
  } catch (error) {
    console.log(error);
  }
};


exports.updateMessageSeen = async (req, res) => {
  try {
    await ChatMessages.update(
      { receiver : req.body.receiver, sender: req.body.sender, seen: false },
      { seen: true },
      { multi: true }
    );
    return res.json({msg: 'Mensajes actualizados con exito'});
  } catch (e) {
    return res.status(201).json({msg: 'Error al actualizar los mensajes'})
  }
};