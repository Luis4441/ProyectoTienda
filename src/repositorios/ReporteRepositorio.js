const pool = require("../config/conexionBD");

class ReporteRepositorio {

    // a) Listado de usuarios
    async listarUsuarios() {
        const resultado = await pool.query(
            `SELECT cedula, nombre_completo, correo, nombre_usuario, contrasena
             FROM usuarios
             ORDER BY nombre_completo ASC`
        );
        return resultado.rows;
    }

    // b) Listado de clientes
    async listarClientes() {
        const resultado = await pool.query(
            `SELECT cedula, nombre_completo, correo, direccion, telefono
             FROM clientes
             ORDER BY nombre_completo ASC`
        );
        return resultado.rows;
    }

    // c) Total de ventas por cliente
    async ventasPorCliente() {
        const resultado = await pool.query(
            `SELECT c.cedula, c.nombre_completo, 
                    COALESCE(SUM(v.total_con_iva), 0) AS valor_total_ventas
             FROM clientes c
             LEFT JOIN ventas v ON v.cedula_cliente = c.cedula
             GROUP BY c.cedula, c.nombre_completo
             ORDER BY valor_total_ventas DESC`
        );
        return resultado.rows;
    }
}

module.exports = new ReporteRepositorio();