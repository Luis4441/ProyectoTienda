const pool = require("../config/conexionBD");
const Venta = require("../modelos/Venta");
const DetalleVenta = require("../modelos/DetalleVenta");

class VentaRepositorio {

    // ── INICIALIZAR TABLAS ─────────────────────────────────────────────────────
    async inicializarTablas() {
        await pool.query(`
            CREATE TABLE IF NOT EXISTS ventas (
                id              SERIAL PRIMARY KEY,
                codigo_venta    BIGSERIAL UNIQUE,
                cedula_cliente  VARCHAR(20)       NOT NULL,
                cedula_usuario  VARCHAR(20)       NOT NULL,
                valor_total     DOUBLE PRECISION  NOT NULL,
                valor_iva       DOUBLE PRECISION  NOT NULL,
                total_con_iva   DOUBLE PRECISION  NOT NULL,
                fecha           TIMESTAMP         DEFAULT NOW()
            )
        `);

        await pool.query(`
            CREATE TABLE IF NOT EXISTS detalle_ventas (
                id               SERIAL PRIMARY KEY,
                codigo_venta     BIGINT            NOT NULL REFERENCES ventas(codigo_venta) ON DELETE CASCADE,
                codigo_producto  BIGINT            NOT NULL,
                cantidad         INTEGER           NOT NULL,
                valor_unitario   DOUBLE PRECISION  NOT NULL,
                valor_total      DOUBLE PRECISION  NOT NULL
            )
        `);
    }

    // ── MAPPERS ────────────────────────────────────────────────────────────────
    _mapearVenta(fila) {
        return new Venta(
            fila.id,
            fila.codigo_venta,
            fila.cedula_cliente,
            fila.cedula_usuario,
            parseFloat(fila.valor_total),
            parseFloat(fila.valor_iva),
            parseFloat(fila.total_con_iva),
            fila.fecha
        );
    }

    _mapearDetalle(fila) {
        return new DetalleVenta(
            fila.id,
            fila.codigo_venta,
            fila.codigo_producto,
            fila.cantidad,
            parseFloat(fila.valor_unitario),
            parseFloat(fila.valor_total)
        );
    }

    // ── REGISTRAR VENTA COMPLETA (transacción) ─────────────────────────────────
    async registrar(cedulaCliente, cedulaUsuario, valorTotal, valorIva, totalConIva, items) {
        const client = await pool.connect();
        try {
            await client.query("BEGIN");

            // 1. Insertar cabecera de venta
            const resVenta = await client.query(
                `INSERT INTO ventas (cedula_cliente, cedula_usuario, valor_total, valor_iva, total_con_iva)
                 VALUES ($1, $2, $3, $4, $5)
                 RETURNING *`,
                [cedulaCliente, cedulaUsuario, valorTotal, valorIva, totalConIva]
            );
            const venta = resVenta.rows[0];

            // 2. Insertar cada línea de detalle
            for (const item of items) {
                await client.query(
                    `INSERT INTO detalle_ventas (codigo_venta, codigo_producto, cantidad, valor_unitario, valor_total)
                     VALUES ($1, $2, $3, $4, $5)`,
                    [venta.codigo_venta, item.codigoProducto, item.cantidad, item.valorUnitario, item.valorTotal]
                );
            }

            await client.query("COMMIT");
            return this._mapearVenta(venta);
        } catch (err) {
            await client.query("ROLLBACK");
            throw err;
        } finally {
            client.release();
        }
    }

    // ── LISTAR TODAS LAS VENTAS ────────────────────────────────────────────────
    async listarTodas() {
        const resultado = await pool.query(
            `SELECT * FROM ventas ORDER BY fecha DESC`
        );
        return resultado.rows.map(f => this._mapearVenta(f));
    }

    // ── BUSCAR VENTA POR CÓDIGO ────────────────────────────────────────────────
    async buscarPorCodigo(codigoVenta) {
        const res = await pool.query(
            "SELECT * FROM ventas WHERE codigo_venta = $1",
            [codigoVenta]
        );
        if (res.rows.length === 0) return null;
        return this._mapearVenta(res.rows[0]);
    }

    // ── OBTENER DETALLE DE UNA VENTA ───────────────────────────────────────────
    async obtenerDetalle(codigoVenta) {
        const res = await pool.query(
            `SELECT dv.*, p.nombre_producto
             FROM detalle_ventas dv
             LEFT JOIN productos p ON p.codigo_producto = dv.codigo_producto
             WHERE dv.codigo_venta = $1`,
            [codigoVenta]
        );
        return res.rows;
    }

    // ── OBTENER VENTA COMPLETA (cabecera + detalle) ───────────────────────────
    async obtenerCompleta(codigoVenta) {
        const venta   = await this.buscarPorCodigo(codigoVenta);
        if (!venta) return null;
        const detalle = await this.obtenerDetalle(codigoVenta);
        return { venta, detalle };
    }
}

module.exports = new VentaRepositorio();