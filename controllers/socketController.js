const ChatMessages = require("../models/Chat");
const Usuario = require("../models/Usuario");
const mongoose = require("mongoose");

exports = module.exports = function (io) {
  //array de usuarios conectados con Ws
  let users = [];

  io.sockets.on("connection", function (socket) {

    console.log("client connected");
    //cuando un cliente se conecta se guarda en el array de arriba
    socket.on("user_chat_connected", function (userId) {
      users[userId] = socket.id;
      console.log(users);
    });
    //cuando alguien manda un mensaje
    socket.on("send_message", async function (data) {
      var newMessage = await new ChatMessages(data).save();

      newMessage = await newMessage
        .populate("sender", "foto nombre id")
        .populate("receiver", "foto nombre id")
        .execPopulate();
      
      // Comprobar si el usuario tenía ya una conversacion
      // si no la tenía se añade la ID del usuario remitente al su perfil en chats

      newMessage = newMessage.toJSON();

      const senderUser = await Usuario.findById(data.sender);

      if (!senderUser.chats.includes(data.receiver)) {
        await Usuario.findOneAndUpdate(
          { _id: data.sender },
          { $push: { chats: data.receiver } }
        );
        await Usuario.findOneAndUpdate(
          { _id: data.receiver },
          { $push: { chats: data.sender } }
        );

        newMessage.isFirstMessage = true;
      }
      
      if (users[data.receiver]) {
        const socketId = users[data.receiver];
        socket.to(socketId).emit("messageReceived", newMessage);
      }

    });
  });
};
