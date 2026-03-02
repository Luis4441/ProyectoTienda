const pool = require("../config/conexionBD");
const Cliente = require("../modelos/Cliente");

class ClienteRepositorio {

    async inicializarTabla() {
        await pool.query(`
            CREATE TABLE IF NOT EXISTS clientes (
                id              SERIAL PRIMARY KEY,
                cedula          VARCHAR(20)  NOT NULL UNIQUE,
                nombre_completo VARCHAR(120) NOT NULL,
                direccion       VARCHAR(200) NOT NULL,
                telefono        VARCHAR(20)  NOT NULL,
                correo          VARCHAR(100) NOT NULL UNIQUE,
                creado_en       TIMESTAMP DEFAULT NOW()
            )
        `);
    }

    _mapear(fila) {
        return new Cliente(
            fila.id,
            fila.cedula,
            fila.nombre_completo,
            fila.direccion,
            fila.telefono,
            fila.correo
        );
    }

    async buscarPorCedula(cedula) {
        const resultado = await pool.query(
            "SELECT * FROM clientes WHERE cedula = $1",
            [cedula]
        );
        if (resultado.rows.length === 0) return null;
        return this._mapear(resultado.rows[0]);
    }

    async buscarPorId(id) {
        const resultado = await pool.query(
            "SELECT * FROM clientes WHERE id = $1",
            [id]
        );
        if (resultado.rows.length === 0) return null;
        return this._mapear(resultado.rows[0]);
    }

    async listarTodos() {
        const resultado = await pool.query(
            "SELECT id, cedula, nombre_completo, direccion, telefono, correo FROM clientes ORDER BY nombre_completo ASC"
        );
        return resultado.rows;
    }

    async crear(cedula, nombreCompleto, direccion, telefono, correo) {
        const resultado = await pool.query(
            `INSERT INTO clientes (cedula, nombre_completo, direccion, telefono, correo)
             VALUES ($1, $2, $3, $4, $5)
             RETURNING id, cedula, nombre_completo, direccion, telefono, correo`,
            [cedula, nombreCompleto, direccion, telefono, correo]
        );
        return resultado.rows[0];
    }

    async actualizar(cedula, nombreCompleto, direccion, telefono, correo) {
        const resultado = await pool.query(
            `UPDATE clientes
             SET nombre_completo = $1, direccion = $2, telefono = $3, correo = $4
             WHERE cedula = $5
             RETURNING id, cedula, nombre_completo, direccion, telefono, correo`,
            [nombreCompleto, direccion, telefono, correo, cedula]
        );
        if (resultado.rows.length === 0) return null;
        return resultado.rows[0];
    }

    async eliminar(cedula) {
        const resultado = await pool.query(
            "DELETE FROM clientes WHERE cedula = $1 RETURNING id",
            [cedula]
        );
        return resultado.rows.length > 0;
    }

    async existeCedula(cedula) {
        const resultado = await pool.query(
            "SELECT id FROM clientes WHERE cedula = $1",
            [cedula]
        );
        return resultado.rows.length > 0;
    }

    async existeCorreo(correo, excluirCedula = null) {
        const query = excluirCedula
            ? "SELECT id FROM clientes WHERE correo = $1 AND cedula != $2"
            : "SELECT id FROM clientes WHERE correo = $1";
        const params = excluirCedula ? [correo, excluirCedula] : [correo];
        const resultado = await pool.query(query, params);
        return resultado.rows.length > 0;
    }
}

module.exports = new ClienteRepositorio();