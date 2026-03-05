const clienteServicio = require("../servicios/ClienteServicio");

function esValidacion(mensaje) {
    if (!mensaje) return false;
    if (mensaje.includes(" | ")) return true;
    const patrones = [
        "La cédula es requerida", "La cédula debe contener",
        "El nombre completo", "La dirección", "El teléfono",
        "Teléfono inválido", "El correo", "debe tener",
        "no puede superar", "solo puede contener",
        "no tiene un formato válido", "Ya existe un cliente",
        "ya está en uso"
    ];
    return patrones.some(p => mensaje.includes(p));
}

class ClienteControlador {

    async listar(req, res) {
        try {
            const clientes = await clienteServicio.listar();
            res.json(clientes);
        } catch (error) {
            console.error("❌ Error al listar clientes:", error.message);
            res.status(500).json({ error: "Error interno del servidor" });
        }
    }

    async buscarPorCedula(req, res) {
        try {
            const { cedula } = req.params;
            const cliente = await clienteServicio.buscarPorCedula(cedula);
            res.json(cliente);
        } catch (error) {
            console.error("❌ Error al buscar cliente:", error.message);
            const status = error.message === "Cliente no encontrado" ? 404
                : esValidacion(error.message) ? 400
                    : 500;
            res.status(status).json({ error: error.message });
        }
    }

    async crear(req, res) {
        try {
            const cliente = await clienteServicio.crear(req.body);
            res.status(201).json({ mensaje: "Cliente creado exitosamente", cliente });
        } catch (error) {
            console.error("❌ Error al crear cliente:", error.message);
            res.status(esValidacion(error.message) ? 400 : 500)
                .json({ error: error.message });
        }
    }

    async actualizar(req, res) {
        try {
            const { cedula } = req.params;
            const cliente = await clienteServicio.actualizar(cedula, req.body);
            res.json({ mensaje: "Cliente actualizado exitosamente", cliente });
        } catch (error) {
            console.error("❌ Error al actualizar cliente:", error.message);
            const status = error.message === "Cliente no encontrado" ? 404
                : esValidacion(error.message) ? 400
                    : 500;
            res.status(status).json({ error: error.message });
        }
    }

    async eliminar(req, res) {
        try {
            const { cedula } = req.params;
            await clienteServicio.eliminar(cedula);
            res.json({ mensaje: "Cliente eliminado exitosamente" });
        } catch (error) {
            console.error("❌ Error al eliminar cliente:", error.message);
            const status = error.message === "Cliente no encontrado" ? 404
                : esValidacion(error.message) ? 400
                    : 500;
            res.status(status).json({ error: error.message });
        }
    }
}

module.exports = new ClienteControlador();