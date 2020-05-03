const multer = require("multer");
const multerConf = require("../config/multerConf");
const auth = require("../middleware/auth");
const Usuario = require("../models/Usuario");
const tf = require("@tensorflow/tfjs-node");
const fs = require("fs");
const express = require("express");
const router = express.Router();
const labels = ["Hombre", "Mujer"];

const upload = multer({
  storage: multerConf.multerStorage,
  fileFilter: multerConf.multerFilter,
});

//ruta para el reconocimiento facial
router.post("/", auth, upload.single("file"), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ msg: "Debes subir una foto" });
  }
  let user = await Usuario.findById(req.usuario.id);
  user.foto = req.file.path;

  const tensorbuffer = readImage(
    "C:\\Users\\juanc\\Desktop\\fid proyecto\\server\\public\\img\\users\\" +
      req.file.filename
  );
  const model = await tf.loadLayersModel(
    "https://raw.githubusercontent.com/juancastellano115/gender-classifier/master/public/model/model.json"
  );

  const smalImg = tf.image.resizeBilinear(tensorbuffer, [224, 224]);
  const resized = tf.cast(smalImg, "float32");
  const t4d = tf.tensor4d(Array.from(resized.dataSync()), [1, 224, 224, 3]);
  let prediction = model.predict(t4d);
  let predicted = await prediction.dataSync();
  let i = predicted.indexOf(Math.max(...predicted));
  user.genero = labels[i];
  await  user.save();
  res.json({genero: user.genero});
});

const readImage = (path) => {
  const imageBuffer = fs.readFileSync(path);
  const tfimage = tf.node.decodeImage(imageBuffer, 3);
  return tfimage;
};

module.exports = router;
