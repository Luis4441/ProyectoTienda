const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const usuarioRepositorio = require("../repositorios/UsuarioRepositorio");

class UsuarioServicio {

    async login(nombreUsuario, contrasena) {
        console.log("→ Buscando usuario:", nombreUsuario);

        const usuario = await usuarioRepositorio.buscarPorNombre(nombreUsuario);
        console.log("→ Usuario encontrado:", usuario);

        if (!usuario) {
            throw new Error("Usuario no encontrado");
        }

        console.log("→ Contraseña ingresada:", contrasena);
        console.log("→ Hash en BD:", usuario.contrasena);

        const coincide = await bcrypt.compare(contrasena, usuario.contrasena);
        console.log("→ Contraseñas coinciden:", coincide);

        if (!coincide) {
            throw new Error("Contraseña incorrecta");
        }

        const token = jwt.sign(
            { id: usuario.id, rol: usuario.rol },
            "CLAVE_SECRETA",
            { expiresIn: "2h" }
        );

        return token;
    }
}

module.exports = new UsuarioServicio();