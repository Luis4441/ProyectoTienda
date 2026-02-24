const usuarioServicio = require("../servicios/UsuarioServicio");

class UsuarioControlador {

    async listar(req, res) {
        try {
            const usuarios = await usuarioServicio.listar();
            res.json(usuarios);
        } catch (error) {
            console.error("❌ Error al listar usuarios:", error.message);
            res.status(500).json({ error: "Error interno del servidor" });
        }
    }

    async crear(req, res) {
        try {
            const usuario = await usuarioServicio.crear(req.body);
            res.status(201).json({ mensaje: "Usuario creado exitosamente", usuario });
        } catch (error) {
            console.error("❌ Error al crear usuario:", error.message);
            const esValidacion = [
                "Todos los campos son requeridos",
                "Ya existe un usuario con esa cédula",
                "El nombre de usuario ya está en uso",
                "El correo electrónico ya está en uso"
            ].includes(error.message);
            res.status(esValidacion ? 400 : 500).json({ error: error.message });
        }
    }

    async actualizar(req, res) {
        try {
            const { id } = req.params;
            const usuario = await usuarioServicio.actualizar(parseInt(id), req.body);
            res.json({ mensaje: "Usuario actualizado exitosamente", usuario });
        } catch (error) {
            console.error("❌ Error al actualizar usuario:", error.message);
            const esValidacion = [
                "Todos los campos son requeridos",
                "Usuario no encontrado",
                "Ya existe un usuario con esa cédula",
                "El nombre de usuario ya está en uso",
                "El correo electrónico ya está en uso",
                "No se puede modificar el usuario administrador inicial"
            ].includes(error.message);
            res.status(esValidacion ? 400 : 500).json({ error: error.message });
        }
    }

    async eliminar(req, res) {
        try {
            const { id } = req.params;
            await usuarioServicio.eliminar(parseInt(id));
            res.json({ mensaje: "Usuario eliminado exitosamente" });
        } catch (error) {
            console.error("❌ Error al eliminar usuario:", error.message);
            const esValidacion = [
                "Usuario no encontrado",
                "No se puede eliminar el usuario administrador inicial"
            ].includes(error.message);
            res.status(esValidacion ? 400 : 500).json({ error: error.message });
        }
    }
}

module.exports = new UsuarioControlador();