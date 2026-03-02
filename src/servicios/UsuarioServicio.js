const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const usuarioRepositorio = require("../repositorios/UsuarioRepositorio");

class UsuarioServicio {

    // ── LOGIN ──
    async login(nombreUsuario, contrasena) {
        const usuario = await usuarioRepositorio.buscarPorNombre(nombreUsuario);

        if (!usuario) throw new Error("Usuario no encontrado");

        const coincide = await bcrypt.compare(contrasena, usuario.contrasena);
        if (!coincide) throw new Error("Contraseña incorrecta");

        const token = jwt.sign(
            {
                id:            usuario.id,
                rol:           usuario.rol,
                nombreUsuario: usuario.nombreUsuario
            },
            process.env.JWT_SECRET || "secreto",  // ✅ CORREGIDO: mismo secreto que el middleware
            { expiresIn: "2h" }
        );

        return token;
    }

    // ── LISTAR ──
    async listar() {
        return await usuarioRepositorio.listarTodos();
    }

    // ── CREAR ──
    async crear(datos) {
        const { cedula, nombreCompleto, nombreUsuario, correo, contrasena } = datos;

        if (!cedula || !nombreCompleto || !nombreUsuario || !correo || !contrasena) {
            throw new Error("Todos los campos son requeridos");
        }

        if (await usuarioRepositorio.existeCedula(cedula)) {
            throw new Error("Ya existe un usuario con esa cédula");
        }
        if (await usuarioRepositorio.existeNombreUsuario(nombreUsuario)) {
            throw new Error("El nombre de usuario ya está en uso");
        }
        if (await usuarioRepositorio.existeCorreo(correo)) {
            throw new Error("El correo electrónico ya está en uso");
        }

        const hash = await bcrypt.hash(contrasena, 10);

        return await usuarioRepositorio.crear(
            cedula, nombreCompleto, nombreUsuario, correo, hash, "ADMIN"
        );
    }

    // ── ACTUALIZAR ──
    async actualizar(id, datos) {
        const { cedula, nombreCompleto, nombreUsuario, correo } = datos;

        if (!cedula || !nombreCompleto || !nombreUsuario || !correo) {
            throw new Error("Todos los campos son requeridos");
        }

        const existente = await usuarioRepositorio.buscarPorId(id);
        if (!existente) throw new Error("Usuario no encontrado");

        if (existente.nombreUsuario === "admininicial") {
            throw new Error("No se puede modificar el usuario administrador inicial");
        }

        if (await usuarioRepositorio.existeCedula(cedula, id)) {
            throw new Error("Ya existe un usuario con esa cédula");
        }
        if (await usuarioRepositorio.existeNombreUsuario(nombreUsuario, id)) {
            throw new Error("El nombre de usuario ya está en uso");
        }
        if (await usuarioRepositorio.existeCorreo(correo, id)) {
            throw new Error("El correo electrónico ya está en uso");
        }

        return await usuarioRepositorio.actualizar(id, cedula, nombreCompleto, nombreUsuario, correo, "ADMIN");
    }

    // ── ELIMINAR ──
    async eliminar(id) {
        const existente = await usuarioRepositorio.buscarPorId(id);
        if (!existente) throw new Error("Usuario no encontrado");

        if (existente.nombreUsuario === "admininicial") {
            throw new Error("No se puede eliminar el usuario administrador inicial");
        }

        const eliminado = await usuarioRepositorio.eliminar(id);
        if (!eliminado) throw new Error("No se pudo eliminar el usuario");
    }
}

module.exports = new UsuarioServicio();