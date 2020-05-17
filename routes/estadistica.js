const express = require("express");
const router = express.Router();
const estadisticaController = require('../controllers/estadisticaController')
const auth = require('../middleware/auth')
const adminCheck = require('../middleware/adminCheck')

router.get('/',auth,adminCheck, estadisticaController.getEstadisticas)

module.exports = router