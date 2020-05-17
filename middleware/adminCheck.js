module.exports = function (req, res, next) {
    //comprobamos que hay alguien autorizado
    if (req.usuario) {
        //extraemos el rol del JWT
        let rol = req.usuario.rol; 
        //si el rol no es Admin le echamos
        //sino, queda autenticado
        if(rol !== 'ADMIN'){
          return res.status(401).json({
            msg: 'Solo usuarios admin autorizados'
          })
        }
        
        next();
    }
}