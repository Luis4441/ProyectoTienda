const usuarioServicio = require("../servicios/UsuarioServicio");

class AuthControlador {

    async login(req, res) {
        try {
            const { nombreUsuario, contrasena } = req.body;

            if (!nombreUsuario || !contrasena) {
                return res.status(400).json({ error: "Usuario y contraseña son requeridos" });
            }

            const token = await usuarioServicio.login(nombreUsuario, contrasena);

            res.json({
                mensaje: "Login exitoso",
                token: token
            });

        } catch (error) {
            console.error("❌ Error en login:", error.message);

            // Distinguir error de cliente vs error de servidor
            const esErrorDeCredenciales =
                error.message === "Usuario no encontrado" ||
                error.message === "Contraseña incorrecta";

            if (esErrorDeCredenciales) {
                return res.status(401).json({ error: error.message });
            }

            res.status(500).json({ error: "Error interno del servidor" });
        }
    }
}

module.exports = new AuthControlador();