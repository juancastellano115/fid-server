const Articulo = require("../models/Articulo");
const Usuario = require("../models/Usuario");
const Chat = require("../models/Chat");

exports.getEstadisticas = async (req, res) => {
  const numArticulos = await Articulo.countDocuments();
  const numUsuarios = await Usuario.countDocuments();
  const usuarioConMasEstrellas = await Usuario.findOne()
    .sort({ likes: -1 })
    .limit(1);
  const mejoresUsuarios = await Usuario.aggregate([
    {
      $sort: {
        likes: -1,
      },
    },
    {
      $limit: 10,
    },
    {
      $project: {
        registro: {
          $dateToString: { format: "%d-%m-%Y", date: "$registro" },
        },
        nombre : 1,
        email : 1,
        genero : 1,
        likes : 1,
        rol : 1,
        _id: 0
      },
    },
  ]);
  //graficos
  const registros = await Usuario.aggregate([
    {
      $group: {
        _id: {
          day: { $dayOfMonth: "$registro" },
          month: { $month: "$registro" },
          year: { $year: "$registro" },
        },
        count: { $sum: 1 },
        date: { $first: "$registro" },
      },
    },
    {
      $match: {
        date: { $gte: new Date(new Date() - 7 * 60 * 60 * 24 * 1000) },
      },
    },
    {
      $project: {
        date: {
          $dateToString: { format: "%Y-%m-%d", date: "$date" },
        },
        count: 1,
        _id: 0,
      },
    },
  ]);
  const ActividadMensajes = await Chat.aggregate([
    {
      $group: {
        _id: {
          day: { $dayOfMonth: "$createdAt" },
          month: { $month: "$createdAt" },
          year: { $year: "$createdAt" },
        },
        count: { $sum: 1 },
        date: { $first: "$createdAt" },
      },
    },
    {
      $match: {
        date: { $gte: new Date(new Date() - 7 * 60 * 60 * 24 * 1000) },
      },
    },
    {
      $project: {
        date: {
          $dateToString: { format: "%Y-%m-%d", date: "$date" },
        },
        count: 1,
        _id: 0,
      },
    },
  ]);

  const fechaHoy = () => {
    today = new Date();
    today.setHours(0, 0, 0, 0);
    return today;
  };
  const articulosHoy = await Articulo.aggregate([
    {
      $match: {
        fecha: { $gte: fechaHoy() },
      },
    },
    {
      $sort: {
        fecha: 1,
      },
    },
    {
      $group: { _id: "$fecha", count: { $sum: 1 }, date: { $first: "$fecha" } },
    },
    {
      $project: {
        count: 1,
        date: 1,
        _id: 0,
      },
    },
  ]);

  res.json({
    numArticulos,
    numUsuarios,
    usuarioConMasEstrellas,
    mejoresUsuarios,
    registros,
    ActividadMensajes,
    articulosHoy,
  });
};
