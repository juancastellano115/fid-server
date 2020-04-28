const mongoose = require('mongoose');
require('dotenv').config({path: 'variables.env'})

const conectarDB = async ()=>{
    try {
        await mongoose.connect(process.env.DB_MONGO, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false,
            useCreateIndex: true,
        })
        console.log("Conectado a mongoDB")
    } catch (error) {
        console.log(error)
        //si hay un errror se sale de la app
        process.exit(1)

    }
}

module.exports = conectarDB