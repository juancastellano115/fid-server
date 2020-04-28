const express = require('express')
const conectarDB = require('./config/db')
//crear el servidor
const app  = express();

//conectar a la BD
conectarDB()

//Habilitar parseo de json
app.use(express.json({extended: true}))
//definir puerto
const PORT  = process.env.PORT || 4000;

//importar rutas
app.use('/api/usuarios',require('./routes/usuarios'))
app.use('/api/auth',require('./routes/auth'))

//escuchar
app.listen(PORT, ()=>{
    console.log(`El servidor está escuchando en el puerto ${PORT}`);
});
