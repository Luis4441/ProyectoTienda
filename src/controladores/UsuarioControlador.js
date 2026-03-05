const usuarioServicio = require("../servicios/UsuarioServicio");

// Detecta si el mensaje proviene de una validación de formato o de negocio
function esValidacion(mensaje) {
    if (!mensaje) return false;
    if (mensaje.includes(" | ")) return true;  // múltiples errores del servicio
    const patrones = [
        "La cédula", "El nombre completo", "El nombre de usuario",
        "El correo", "La contraseña", "debe tener", "no puede superar",
        "solo puede contener", "no tiene un formato válido",
        "Solo dígitos", "Solo letras",
        "Todos los campos son requeridos",
        "Ya existe un usuario", "ya está en uso",
        "Usuario no encontrado",
        "No se puede modificar el usuario administrador inicial",
        "No se puede eliminar el usuario administrador inicial"
    ];
    return patrones.some(p => mensaje.includes(p));
}

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
            res.status(esValidacion(error.message) ? 400 : 500)
                .json({ error: error.message });
        }
    }

    async actualizar(req, res) {
        try {
            const { id } = req.params;
            const usuario = await usuarioServicio.actualizar(parseInt(id), req.body);
            res.json({ mensaje: "Usuario actualizado exitosamente", usuario });
        } catch (error) {
            console.error("❌ Error al actualizar usuario:", error.message);
            const status = error.message === "Usuario no encontrado" ? 404
                : esValidacion(error.message) ? 400
                    : 500;
            res.status(status).json({ error: error.message });
        }
    }

    async eliminar(req, res) {
        try {
            const { id } = req.params;
            await usuarioServicio.eliminar(parseInt(id));
            res.json({ mensaje: "Usuario eliminado exitosamente" });
        } catch (error) {
            console.error("❌ Error al eliminar usuario:", error.message);
            const status = error.message === "Usuario no encontrado" ? 404
                : esValidacion(error.message) ? 400
                    : 500;
            res.status(status).json({ error: error.message });
        }
    }
}

module.exports = new UsuarioControlador();