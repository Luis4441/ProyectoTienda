const pool = require("../config/conexionBD");
const Proveedor = require("../modelos/Proveedor");

class ProveedorRepositorio {

    async inicializarTabla() {
        await pool.query(`
            CREATE TABLE IF NOT EXISTS proveedores (
                id                SERIAL PRIMARY KEY,
                nit               VARCHAR(20)  NOT NULL UNIQUE,
                nombre_proveedor  VARCHAR(120) NOT NULL,
                direccion         VARCHAR(200) NOT NULL,
                telefono          VARCHAR(20)  NOT NULL,
                ciudad            VARCHAR(100) NOT NULL,
                creado_en         TIMESTAMP DEFAULT NOW()
            )
        `);
    }

    _mapear(fila) {
        return new Proveedor(
            fila.id,
            fila.nit,
            fila.nombre_proveedor,
            fila.direccion,
            fila.telefono,
            fila.ciudad
        );
    }

    async buscarPorNit(nit) {
        const resultado = await pool.query(
            "SELECT * FROM proveedores WHERE nit = $1",
            [nit]
        );
        if (resultado.rows.length === 0) return null;
        return this._mapear(resultado.rows[0]);
    }

    async buscarPorId(id) {
        const resultado = await pool.query(
            "SELECT * FROM proveedores WHERE id = $1",
            [id]
        );
        if (resultado.rows.length === 0) return null;
        return this._mapear(resultado.rows[0]);
    }

    async listarTodos() {
        const resultado = await pool.query(
            "SELECT id, nit, nombre_proveedor, direccion, telefono, ciudad FROM proveedores ORDER BY nombre_proveedor ASC"
        );
        return resultado.rows;
    }

    async crear(nit, nombreProveedor, direccion, telefono, ciudad) {
        const resultado = await pool.query(
            `INSERT INTO proveedores (nit, nombre_proveedor, direccion, telefono, ciudad)
             VALUES ($1, $2, $3, $4, $5)
             RETURNING id, nit, nombre_proveedor, direccion, telefono, ciudad`,
            [nit, nombreProveedor, direccion, telefono, ciudad]
        );
        return resultado.rows[0];
    }

    async actualizar(nit, nombreProveedor, direccion, telefono, ciudad) {
        const resultado = await pool.query(
            `UPDATE proveedores
             SET nombre_proveedor = $1, direccion = $2, telefono = $3, ciudad = $4
             WHERE nit = $5
             RETURNING id, nit, nombre_proveedor, direccion, telefono, ciudad`,
            [nombreProveedor, direccion, telefono, ciudad, nit]
        );
        if (resultado.rows.length === 0) return null;
        return resultado.rows[0];
    }

    async eliminar(nit) {
        const resultado = await pool.query(
            "DELETE FROM proveedores WHERE nit = $1 RETURNING id",
            [nit]
        );
        return resultado.rows.length > 0;
    }

    async existeNit(nit) {
        const resultado = await pool.query(
            "SELECT id FROM proveedores WHERE nit = $1",
            [nit]
        );
        return resultado.rows.length > 0;
    }
}

module.exports = new ProveedorRepositorio();