const Articulo = require("../models/Articulo");
const Usuario = require("../models/Usuario");
const Chat = require("../models/Chat");
// devuelve estadísticas de la bdd
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
      $sort: {
        date: 1,
      },
    },
    {
      $project: {
        date: {
          $dateToString: { format: "%d-%m-%Y", date: "$date" },
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
      $sort: {
        date: 1,
      },
    },
    {
      $project: {
        date: {
          $dateToString: { format: "%d-%m-%Y", date: "$date" },
        },
        count: 1,
        _id: 0,
      },
    },
  ]);

  const articulosHoy = await Articulo.aggregate([
    {
      $match: {
        fecha: { $gte: new Date(new Date() - 7 * 60 * 60 * 24 * 1000) },
      },
    },
    {
      $group: { _id: "$fecha", count: { $sum: 1 }, date: { $first: "$fecha" } },
    },
    {
      $sort: {
        date: 1,
      },
    },
    {
      $project: {
        count: 1,
        date: { $dateToString: { format: "%d-%m-%Y", date: "$date" },},
        _id: 0,
      },
    },
  ]);
  const generos = await Usuario.aggregate([
    {
      $group: {
        _id: "$genero",
        count: { $sum: 1 }
      }
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
    generos
  });
};
