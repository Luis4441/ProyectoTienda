const ReporteServicio = require("../servicios/ReporteServicio");

class ReporteControlador {

    async listarUsuarios(req, res) {
        try {
            const datos = await ReporteServicio.listarUsuarios();
            res.json(datos);
        } catch (err) {
            console.error("Error al listar usuarios:", err);
            res.status(500).json({ error: "Error al obtener listado de usuarios" });
        }
    }

    async listarClientes(req, res) {
        try {
            const datos = await ReporteServicio.listarClientes();
            res.json(datos);
        } catch (err) {
            console.error("Error al listar clientes:", err);
            res.status(500).json({ error: "Error al obtener listado de clientes" });
        }
    }

    async ventasPorCliente(req, res) {
        try {
            const datos = await ReporteServicio.ventasPorCliente();
            res.json(datos);
        } catch (err) {
            console.error("Error al obtener ventas por cliente:", err);
            res.status(500).json({ error: "Error al obtener ventas por cliente" });
        }
    }
}

module.exports = new ReporteControlador();