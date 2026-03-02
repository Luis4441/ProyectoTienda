const pool = require("../config/conexionBD");
const Producto = require("../modelos/Producto");

class ProductoRepositorio {

    async inicializarTabla() {
        await pool.query(`
            CREATE TABLE IF NOT EXISTS productos (
                id               SERIAL PRIMARY KEY,
                codigo_producto  BIGINT       NOT NULL UNIQUE,
                nombre_producto  VARCHAR(50)  NOT NULL,
                nit_proveedor    BIGINT       NOT NULL,
                precio_compra    DOUBLE PRECISION NOT NULL,
                iva_compra       DOUBLE PRECISION NOT NULL,
                precio_venta     DOUBLE PRECISION NOT NULL,
                cargado_en       TIMESTAMP DEFAULT NOW()
            )
        `);
    }

    _mapear(fila) {
        return new Producto(
            fila.id,
            fila.codigo_producto,
            fila.nombre_producto,
            fila.nit_proveedor,
            fila.precio_compra,
            fila.iva_compra,
            fila.precio_venta
        );
    }

    async listarTodos() {
        const resultado = await pool.query(
            `SELECT id, codigo_producto, nombre_producto, nit_proveedor,
                    precio_compra, iva_compra, precio_venta
             FROM productos ORDER BY nombre_producto ASC`
        );
        return resultado.rows;
    }

    async buscarPorCodigo(codigoProducto) {
        const resultado = await pool.query(
            "SELECT * FROM productos WHERE codigo_producto = $1",
            [codigoProducto]
        );
        if (resultado.rows.length === 0) return null;
        return this._mapear(resultado.rows[0]);
    }

    /**
     * Reemplaza TODOS los productos con los del array recibido.
     * Se ejecuta dentro de una transacción: DELETE + INSERT masivo.
     */
    async reemplazarTodos(productos) {
        const client = await pool.connect();
        try {
            await client.query("BEGIN");
            await client.query("DELETE FROM productos");

            for (const p of productos) {
                await client.query(
                    `INSERT INTO productos
                        (codigo_producto, nombre_producto, nit_proveedor, precio_compra, iva_compra, precio_venta)
                     VALUES ($1, $2, $3, $4, $5, $6)`,
                    [p.codigoProducto, p.nombreProducto, p.nitProveedor,
                        p.precioCompra,   p.ivaCompra,      p.precioVenta]
                );
            }

            await client.query("COMMIT");
            return productos.length;
        } catch (err) {
            await client.query("ROLLBACK");
            throw err;
        } finally {
            client.release();
        }
    }

    async contarProductos() {
        const resultado = await pool.query("SELECT COUNT(*) FROM productos");
        return parseInt(resultado.rows[0].count, 10);
    }
}

module.exports = new ProductoRepositorio();