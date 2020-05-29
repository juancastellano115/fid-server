const express = require("express");
const conectarDB = require("./config/db");
const cors = require("cors");
const morgan = require("morgan");
const resize = require("./controllers/ImageController");
//crear el servidor
const app = express();
const http = require("http").createServer(app);
//echufar los sockets
var io = require("socket.io")(http);
//conectar a la BD
conectarDB();

app.use(cors());
app.use(morgan("tiny"));
//directorio público
app.get("/resources/:tipo/:path", (req, res) => {
  const widthString = req.query.width;
  const heightString = req.query.height;
  let width, height;

  if (widthString) {
    width = parseInt(widthString);
  }
  if (heightString) {
    height = parseInt(heightString);
  }
  res.type("image/png");
  if (req.params.path === "undefined" || req.params.path == "null" ) {
    resize(
      "public/img/" + req.params.tipo + "/undefined.svg",
      width,
      height
    ).pipe(res);
  } else {
    resize(
      "public/img/" + req.params.tipo + "/" + req.params.path,
      width,
      height
    ).pipe(res);
  }
});

//Habilitar parseo de json
app.use(express.json({ extended: true }));
//definir puerto
const PORT = process.env.PORT || 4000;

//importar rutas
app.use("/api/usuarios", require("./routes/usuarios"));
app.use("/api/auth", require("./routes/auth"));
app.use("/api/fotoRecog", require("./routes/fotoRecog"));
app.use("/api/articulos", require("./routes/articulos"));
app.use("/api/chat", require("./routes/chats"));
app.use("/api/estadisticas", require("./routes/estadistica"));

//manejador de los sockets
sockethandler = require("./controllers/socketController")(io);
//escuchar
http.listen(PORT, () => {
  console.log(`El servidor está escuchando en el puerto ${PORT}`);
});
