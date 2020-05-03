const express = require('express')
const conectarDB = require('./config/db')
const cors = require('cors')
const morgan = require('morgan')
//crear el servidor
const app  = express();
//conectar a la BD
conectarDB();

app.use(cors())
app.use(morgan('tiny'))
//directorio público
app.use('/resources',express.static('public'));
//Habilitar parseo de json
app.use(express.json({extended: true}))
//definir puerto
const PORT  = process.env.PORT || 4000;

//importar rutas
app.use('/api/usuarios',require('./routes/usuarios'))
app.use('/api/auth',require('./routes/auth'))
app.use('/api/fotoRecog',require('./routes/fotoRecog'))
app.use('/api/articulos',require('./routes/articulos'))

//escuchar
app.listen(PORT, ()=>{
    console.log(`El servidor está escuchando en el puerto ${PORT}`);
});
