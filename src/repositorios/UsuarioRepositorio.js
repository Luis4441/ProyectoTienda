const pool = require("../config/conexionBD");
const Usuario = require("../modelos/Usuario");

class UsuarioRepositorio {

    async buscarPorNombre(nombreUsuario) {
        const resultado = await pool.query(
            "SELECT * FROM usuarios WHERE nombre_usuario = $1",
            [nombreUsuario]
        );

        if (resultado.rows.length === 0) return null;

        const fila = resultado.rows[0];
        return new Usuario(
            fila.id,
            fila.nombre_usuario,
            fila.contrasena,
            fila.rol
        );
    }
}

module.exports = new UsuarioRepositorio();