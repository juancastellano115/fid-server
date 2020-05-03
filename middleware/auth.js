const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
    //leer el token del header
    const token = req.header('x-auth-token')
    //revisar si no hay token 
    if (!token) {
        res.status(401).json({msg: 'no hay token, no autorizado'})
    }
    //validar el token
    try {
        const cifrado = jwt.verify(token, process.env.SECRET);
        req.usuario = cifrado.usuario;
        next()
    } catch (error) {
        res.status(401).json({msg: 'token no valido, no autorizado'})
    }
}