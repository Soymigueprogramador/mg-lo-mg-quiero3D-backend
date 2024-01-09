import dtoUsuario from "./dtoUsuarios.js";

function DatosDeUsuarios(req, res, next) {
    try {
        const usuario = req.session.usuario;
        const formatoDeUsuario = {
            name: usuario.name,
            email: usuario.email,
            cartId: usuario.cartId,
            typeofuser: usuario.typeofuser,
            age: usuario.age,
            last_name: usuario.last_name,
        };
        req.datos = { usuario: formatoDeUsuario };
        next();
    } catch (error) {
        console.log("Error en el middleware de datos de usuarios", error);
        return res.status(500).send({ mensaje: "Error en el servidor" });
    }
}

export default DatosDeUsuarios;
