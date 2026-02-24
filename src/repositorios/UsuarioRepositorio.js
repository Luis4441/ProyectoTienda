const pool = require("../config/conexionBD");
const Usuario = require("../modelos/Usuario");

class UsuarioRepositorio {

    _mapear(fila) {
        return new Usuario(
            fila.id,
            fila.cedula,
            fila.nombre_completo,
            fila.nombre_usuario,
            fila.correo,
            fila.contrasena,
            fila.rol
        );
    }

    async buscarPorNombre(nombreUsuario) {
        const resultado = await pool.query(
            "SELECT * FROM usuarios WHERE nombre_usuario = $1",
            [nombreUsuario]
        );
        if (resultado.rows.length === 0) return null;
        return this._mapear(resultado.rows[0]);
    }

    async buscarPorId(id) {
        const resultado = await pool.query(
            "SELECT * FROM usuarios WHERE id = $1",
            [id]
        );
        if (resultado.rows.length === 0) return null;
        return this._mapear(resultado.rows[0]);
    }

    async listarTodos() {
        const resultado = await pool.query(
            "SELECT id, cedula, nombre_completo, nombre_usuario, correo, rol FROM usuarios ORDER BY id ASC"
        );
        return resultado.rows;
    }

    async crear(cedula, nombreCompleto, nombreUsuario, correo, contrasena, rol) {
        const resultado = await pool.query(
            `INSERT INTO usuarios (cedula, nombre_completo, nombre_usuario, correo, contrasena, rol)
             VALUES ($1, $2, $3, $4, $5, $6)
             RETURNING id, cedula, nombre_completo, nombre_usuario, correo, rol`,
            [cedula, nombreCompleto, nombreUsuario, correo, contrasena, rol]
        );
        return resultado.rows[0];
    }

    async actualizar(id, cedula, nombreCompleto, nombreUsuario, correo, rol) {
        const resultado = await pool.query(
            `UPDATE usuarios
             SET cedula = $1, nombre_completo = $2, nombre_usuario = $3, correo = $4, rol = $5
             WHERE id = $6
             RETURNING id, cedula, nombre_completo, nombre_usuario, correo, rol`,
            [cedula, nombreCompleto, nombreUsuario, correo, rol, id]
        );
        if (resultado.rows.length === 0) return null;
        return resultado.rows[0];
    }

    async actualizarContrasena(id, contrasena) {
        await pool.query(
            "UPDATE usuarios SET contrasena = $1 WHERE id = $2",
            [contrasena, id]
        );
    }

    async eliminar(id) {
        const resultado = await pool.query(
            "DELETE FROM usuarios WHERE id = $1 RETURNING id",
            [id]
        );
        return resultado.rows.length > 0;
    }

    async existeCedula(cedula, excluirId = null) {
        const query = excluirId
            ? "SELECT id FROM usuarios WHERE cedula = $1 AND id != $2"
            : "SELECT id FROM usuarios WHERE cedula = $1";
        const params = excluirId ? [cedula, excluirId] : [cedula];
        const resultado = await pool.query(query, params);
        return resultado.rows.length > 0;
    }

    async existeNombreUsuario(nombreUsuario, excluirId = null) {
        const query = excluirId
            ? "SELECT id FROM usuarios WHERE nombre_usuario = $1 AND id != $2"
            : "SELECT id FROM usuarios WHERE nombre_usuario = $1";
        const params = excluirId ? [nombreUsuario, excluirId] : [nombreUsuario];
        const resultado = await pool.query(query, params);
        return resultado.rows.length > 0;
    }

    async existeCorreo(correo, excluirId = null) {
        const query = excluirId
            ? "SELECT id FROM usuarios WHERE correo = $1 AND id != $2"
            : "SELECT id FROM usuarios WHERE correo = $1";
        const params = excluirId ? [correo, excluirId] : [correo];
        const resultado = await pool.query(query, params);
        return resultado.rows.length > 0;
    }
}

module.exports = new UsuarioRepositorio();