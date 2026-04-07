// ══════════════════════════════════════════════════════════
//  VentaControlador.js
// ══════════════════════════════════════════════════════════
const ventaServicio = require("../servicios/VentaServicio");

function esValidacion(mensaje) {
    if (!mensaje) return false;
    if (mensaje.includes(" | ")) return true;
    const patrones = [
        "es requerida", "debe contener", "debe ser",
        "Debe agregar", "no encontrado", "no existe",
        "inválido", "mayor a 0", "entero positivo"
    ];
    return patrones.some(p => mensaje.includes(p));
}

class VentaControlador {

    // GET /api/ventas
    async listar(req, res) {
        try {
            const ventas = await ventaServicio.listar();
            res.json(ventas);
        } catch (error) {
            console.error("❌ Error al listar ventas:", error.message);
            res.status(500).json({ error: "Error interno del servidor" });
        }
    }

    // GET /api/ventas/cliente/:cedula
    async buscarCliente(req, res) {
        try {
            const cliente = await ventaServicio.buscarCliente(req.params.cedula);
            res.json(cliente);
        } catch (error) {
            console.error("❌ Error al buscar cliente:", error.message);
            const status = error.message === "Cliente no encontrado" ? 404
                : esValidacion(error.message) ? 400 : 500;
            res.status(status).json({ error: error.message });
        }
    }

    // GET /api/ventas/producto/:codigo
    async buscarProducto(req, res) {
        try {
            const producto = await ventaServicio.buscarProducto(req.params.codigo);
            res.json(producto);
        } catch (error) {
            console.error("❌ Error al buscar producto:", error.message);
            const status = error.message === "Producto no encontrado" ? 404
                : esValidacion(error.message) ? 400 : 500;
            res.status(status).json({ error: error.message });
        }
    }

    // POST /api/ventas
    async registrar(req, res) {
        try {
            const resultado = await ventaServicio.registrar(req.body);
            res.status(201).json({
                mensaje: "Venta registrada exitosamente",
                ...resultado
            });
        } catch (error) {
            console.error("❌ Error al registrar venta:", error.message);
            res.status(esValidacion(error.message) ? 400 : 500)
                .json({ error: error.message });
        }
    }

    // GET /api/ventas/:codigo
    async obtenerCompleta(req, res) {
        try {
            const resultado = await ventaServicio.obtenerCompleta(req.params.codigo);
            res.json(resultado);
        } catch (error) {
            console.error("❌ Error al obtener venta:", error.message);
            const status = error.message === "Venta no encontrada" ? 404
                : esValidacion(error.message) ? 400 : 500;
            res.status(status).json({ error: error.message });
        }
    }
}

module.exports = new VentaControlador();
