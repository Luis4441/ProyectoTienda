const proveedorServicio = require("../servicios/ProveedorServicio");

// Detecta si el mensaje de error viene de una validación (no del servidor)
function esValidacion(mensaje) {
    if (!mensaje) return false;
    if (mensaje.includes(" | ")) return true; // múltiples errores separados por pipe
    const patrones = [
        "El NIT", "NIT inválido", "El nombre", "La dirección",
        "Teléfono inválido", "El teléfono", "La ciudad",
        "debe tener", "no puede superar", "contiene caracteres",
        "solo puede contener", "Ya existe"
    ];
    return patrones.some(p => mensaje.includes(p));
}

class ProveedorControlador {

    async listar(req, res) {
        try {
            const proveedores = await proveedorServicio.listar();
            res.json(proveedores);
        } catch (error) {
            console.error("❌ Error al listar proveedores:", error.message);
            res.status(500).json({ error: "Error interno del servidor" });
        }
    }

    async buscarPorNit(req, res) {
        try {
            const { nit } = req.params;
            const proveedor = await proveedorServicio.buscarPorNit(nit);
            res.json(proveedor);
        } catch (error) {
            console.error("❌ Error al buscar proveedor:", error.message);
            const status = error.message === "Proveedor no encontrado" ? 404
                : esValidacion(error.message) ? 400
                    : 500;
            res.status(status).json({ error: error.message });
        }
    }

    async crear(req, res) {
        try {
            const proveedor = await proveedorServicio.crear(req.body);
            res.status(201).json({ mensaje: "Proveedor creado exitosamente", proveedor });
        } catch (error) {
            console.error("❌ Error al crear proveedor:", error.message);
            res.status(esValidacion(error.message) ? 400 : 500)
                .json({ error: error.message });
        }
    }

    async actualizar(req, res) {
        try {
            const { nit } = req.params;
            const proveedor = await proveedorServicio.actualizar(nit, req.body);
            res.json({ mensaje: "Proveedor actualizado exitosamente", proveedor });
        } catch (error) {
            console.error("❌ Error al actualizar proveedor:", error.message);
            const status = error.message === "Proveedor no encontrado" ? 404
                : esValidacion(error.message) ? 400
                    : 500;
            res.status(status).json({ error: error.message });
        }
    }

    async eliminar(req, res) {
        try {
            const { nit } = req.params;
            await proveedorServicio.eliminar(nit);
            res.json({ mensaje: "Proveedor eliminado exitosamente" });
        } catch (error) {
            console.error("❌ Error al eliminar proveedor:", error.message);
            const status = error.message === "Proveedor no encontrado" ? 404
                : esValidacion(error.message) ? 400
                    : 500;
            res.status(status).json({ error: error.message });
        }
    }
}

module.exports = new ProveedorControlador();