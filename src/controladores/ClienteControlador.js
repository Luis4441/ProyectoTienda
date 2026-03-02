const clienteServicio = require("../servicios/ClienteServicio");

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
            const esValidacion = [
                "La cédula es requerida",
                "Cliente no encontrado"
            ].includes(error.message);
            res.status(esValidacion ? 404 : 500).json({ error: error.message });
        }
    }

    async crear(req, res) {
        try {
            const cliente = await clienteServicio.crear(req.body);
            res.status(201).json({ mensaje: "Cliente creado exitosamente", cliente });
        } catch (error) {
            console.error("❌ Error al crear cliente:", error.message);
            const esValidacion = [
                "Todos los campos son requeridos",
                "Ya existe un cliente con esa cédula",
                "El correo electrónico ya está en uso"
            ].includes(error.message);
            res.status(esValidacion ? 400 : 500).json({ error: error.message });
        }
    }

    async actualizar(req, res) {
        try {
            const { cedula } = req.params;
            const cliente = await clienteServicio.actualizar(cedula, req.body);
            res.json({ mensaje: "Cliente actualizado exitosamente", cliente });
        } catch (error) {
            console.error("❌ Error al actualizar cliente:", error.message);
            const esValidacion = [
                "La cédula es requerida",
                "Todos los campos son requeridos",
                "Cliente no encontrado",
                "El correo electrónico ya está en uso por otro cliente"
            ].includes(error.message);
            res.status(esValidacion ? 400 : 500).json({ error: error.message });
        }
    }

    async eliminar(req, res) {
        try {
            const { cedula } = req.params;
            await clienteServicio.eliminar(cedula);
            res.json({ mensaje: "Cliente eliminado exitosamente" });
        } catch (error) {
            console.error("❌ Error al eliminar cliente:", error.message);
            const esValidacion = [
                "La cédula es requerida",
                "Cliente no encontrado"
            ].includes(error.message);
            res.status(esValidacion ? 404 : 500).json({ error: error.message });
        }
    }
}

module.exports = new ClienteControlador();