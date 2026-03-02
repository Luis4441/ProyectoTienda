const proveedorServicio = require("../servicios/ProveedorServicio");

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
            const esValidacion = ["El NIT es requerido", "Proveedor no encontrado"].includes(error.message);
            res.status(esValidacion ? 404 : 500).json({ error: error.message });
        }
    }

    async crear(req, res) {
        try {
            const proveedor = await proveedorServicio.crear(req.body);
            res.status(201).json({ mensaje: "Proveedor creado exitosamente", proveedor });
        } catch (error) {
            console.error("❌ Error al crear proveedor:", error.message);
            const esValidacion = [
                "Todos los campos son requeridos",
                "Ya existe un proveedor con ese NIT"
            ].includes(error.message);
            res.status(esValidacion ? 400 : 500).json({ error: error.message });
        }
    }

    async actualizar(req, res) {
        try {
            const { nit } = req.params;
            const proveedor = await proveedorServicio.actualizar(nit, req.body);
            res.json({ mensaje: "Proveedor actualizado exitosamente", proveedor });
        } catch (error) {
            console.error("❌ Error al actualizar proveedor:", error.message);
            const esValidacion = [
                "El NIT es requerido",
                "Todos los campos son requeridos",
                "Proveedor no encontrado"
            ].includes(error.message);
            res.status(esValidacion ? 400 : 500).json({ error: error.message });
        }
    }

    async eliminar(req, res) {
        try {
            const { nit } = req.params;
            await proveedorServicio.eliminar(nit);
            res.json({ mensaje: "Proveedor eliminado exitosamente" });
        } catch (error) {
            console.error("❌ Error al eliminar proveedor:", error.message);
            const esValidacion = ["El NIT es requerido", "Proveedor no encontrado"].includes(error.message);
            res.status(esValidacion ? 404 : 500).json({ error: error.message });
        }
    }
}

module.exports = new ProveedorControlador();