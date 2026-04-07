const bcrypt = require("bcrypt");
const jwt    = require("jsonwebtoken");
const usuarioRepositorio = require("../repositorios/UsuarioRepositorio");

// ─── Reglas de validación ────────────────────────────────────────────────────
const REGEX_CEDULA   = /^[0-9]{5,15}$/;
const REGEX_USERNAME = /^[a-zA-Z0-9_.\-]{3,30}$/;
const REGEX_CORREO   = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const REGEX_NOMBRE   = /^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s\-'.]+$/;

function validarCedula(cedula) {
    if (!cedula || typeof cedula !== "string" || !cedula.trim())
        return "La cédula es requerida";
    if (!REGEX_CEDULA.test(cedula.trim()))
        return "La cédula debe contener solo dígitos (5–15 números)";
    return null;
}

function validarNombreCompleto(nombre) {
    if (!nombre || typeof nombre !== "string" || !nombre.trim())
        return "El nombre completo es requerido";
    const v = nombre.trim();
    if (v.length < 3)    return "El nombre debe tener al menos 3 caracteres";
    if (v.length > 150)  return "El nombre no puede superar 150 caracteres";
    if (!REGEX_NOMBRE.test(v))
        return "El nombre solo puede contener letras, espacios, guiones y apóstrofes";
    return null;
}

function validarNombreUsuario(nombreUsuario) {
    if (!nombreUsuario || typeof nombreUsuario !== "string" || !nombreUsuario.trim())
        return "El nombre de usuario es requerido";
    const v = nombreUsuario.trim();
    if (v.length < 3)    return "El nombre de usuario debe tener al menos 3 caracteres";
    if (v.length > 30)   return "El nombre de usuario no puede superar 30 caracteres";
    if (!REGEX_USERNAME.test(v))
        return "El nombre de usuario solo puede contener letras, números, puntos, guiones y guiones bajos";
    return null;
}

function validarCorreo(correo) {
    if (!correo || typeof correo !== "string" || !correo.trim())
        return "El correo electrónico es requerido";
    const v = correo.trim();
    if (v.length > 254)  return "El correo no puede superar 254 caracteres";
    if (!REGEX_CORREO.test(v))
        return "El correo no tiene un formato válido (ej: nombre@dominio.com)";
    return null;
}

function validarContrasena(contrasena) {
    if (!contrasena || typeof contrasena !== "string" || !contrasena)
        return "La contraseña es requerida";
    if (contrasena.length < 6)   return "La contraseña debe tener al menos 6 caracteres";
    if (contrasena.length > 100) return "La contraseña no puede superar 100 caracteres";
    return null;
}

// Acumula todos los errores en una sola pasada
function validarCamposCrear(datos) {
    const errores = [];
    const eC  = validarCedula(datos.cedula);               if (eC)  errores.push(eC);
    const eN  = validarNombreCompleto(datos.nombreCompleto); if (eN)  errores.push(eN);
    const eU  = validarNombreUsuario(datos.nombreUsuario);  if (eU)  errores.push(eU);
    const eCo = validarCorreo(datos.correo);                if (eCo) errores.push(eCo);
    const ePw = validarContrasena(datos.contrasena);        if (ePw) errores.push(ePw);
    return errores;
}

function validarCamposActualizar(datos) {
    const errores = [];
    const eC  = validarCedula(datos.cedula);               if (eC)  errores.push(eC);
    const eN  = validarNombreCompleto(datos.nombreCompleto); if (eN)  errores.push(eN);
    const eU  = validarNombreUsuario(datos.nombreUsuario);  if (eU)  errores.push(eU);
    const eCo = validarCorreo(datos.correo);                if (eCo) errores.push(eCo);
    // contraseña es opcional en actualización
    if (datos.contrasena !== undefined && datos.contrasena !== "") {
        const ePw = validarContrasena(datos.contrasena);   if (ePw) errores.push(ePw);
    }
    return errores;
}

// ─── Servicio ────────────────────────────────────────────────────────────────
class UsuarioServicio {

    // ── LOGIN ──
    async login(nombreUsuario, contrasena) {
        const usuario = await usuarioRepositorio.buscarPorNombre(nombreUsuario);
        if (!usuario) throw new Error("Usuario no encontrado");

        const coincide = await bcrypt.compare(contrasena, usuario.contrasena);
        if (!coincide) throw new Error("Contraseña incorrecta");

        const token = jwt.sign(
            { id: usuario.id, rol: usuario.rol, nombreUsuario: usuario.nombreUsuario,  cedula: usuario.cedula, },
            process.env.JWT_SECRET || "secreto",
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
        const errores = validarCamposCrear(datos);
        if (errores.length > 0) throw new Error(errores.join(" | "));

        const { cedula, nombreCompleto, nombreUsuario, correo, contrasena } = datos;

        if (await usuarioRepositorio.existeCedula(cedula.trim()))
            throw new Error("Ya existe un usuario con esa cédula");
        if (await usuarioRepositorio.existeNombreUsuario(nombreUsuario.trim()))
            throw new Error("El nombre de usuario ya está en uso");
        if (await usuarioRepositorio.existeCorreo(correo.trim()))
            throw new Error("El correo electrónico ya está en uso");

        const hash = await bcrypt.hash(contrasena, 10);

        return await usuarioRepositorio.crear(
            cedula.trim(), nombreCompleto.trim(),
            nombreUsuario.trim(), correo.trim(), hash, "ADMIN"
        );
    }

    // ── ACTUALIZAR ──
    async actualizar(id, datos) {
        const errores = validarCamposActualizar(datos);
        if (errores.length > 0) throw new Error(errores.join(" | "));

        const { cedula, nombreCompleto, nombreUsuario, correo, contrasena } = datos;

        const existente = await usuarioRepositorio.buscarPorId(id);
        if (!existente) throw new Error("Usuario no encontrado");

        if (existente.nombreUsuario === "admininicial")
            throw new Error("No se puede modificar el usuario administrador inicial");

        if (await usuarioRepositorio.existeCedula(cedula.trim(), id))
            throw new Error("Ya existe un usuario con esa cédula");
        if (await usuarioRepositorio.existeNombreUsuario(nombreUsuario.trim(), id))
            throw new Error("El nombre de usuario ya está en uso");
        if (await usuarioRepositorio.existeCorreo(correo.trim(), id))
            throw new Error("El correo electrónico ya está en uso");

        // Si se envía nueva contraseña, hashearla; si no, conservar la existente
        let hashFinal = existente.contrasena;
        if (contrasena && contrasena.trim()) {
            hashFinal = await bcrypt.hash(contrasena, 10);
        }

        return await usuarioRepositorio.actualizar(
            id, cedula.trim(), nombreCompleto.trim(),
            nombreUsuario.trim(), correo.trim(), hashFinal, "ADMIN"
        );
    }

    // ── ELIMINAR ──
    async eliminar(id) {
        const existente = await usuarioRepositorio.buscarPorId(id);
        if (!existente) throw new Error("Usuario no encontrado");

        if (existente.nombreUsuario === "admininicial")
            throw new Error("No se puede eliminar el usuario administrador inicial");

        const eliminado = await usuarioRepositorio.eliminar(id);
        if (!eliminado) throw new Error("No se pudo eliminar el usuario");
    }
}

module.exports = new UsuarioServicio();