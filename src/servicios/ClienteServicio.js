const clienteRepositorio = require("../repositorios/ClienteRepositorio");

// ─── Reglas de validación ────────────────────────────────────────────────────
const REGEX_CEDULA   = /^[0-9]{5,15}$/;
const REGEX_TELEFONO = /^[0-9+\-\s()]{7,20}$/;
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

function validarDireccion(direccion) {
    if (!direccion || typeof direccion !== "string" || !direccion.trim())
        return "La dirección es requerida";
    const v = direccion.trim();
    if (v.length < 5)    return "La dirección debe tener al menos 5 caracteres";
    if (v.length > 200)  return "La dirección no puede superar 200 caracteres";
    return null;
}

function validarTelefono(telefono) {
    if (!telefono || typeof telefono !== "string" || !telefono.trim())
        return "El teléfono es requerido";
    if (!REGEX_TELEFONO.test(telefono.trim()))
        return "Teléfono inválido. Solo números, +, -, paréntesis y espacios (7–20 caracteres)";
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

function validarCampos(datos, incluirCedula = true) {
    const errores = [];
    if (incluirCedula) { const e = validarCedula(datos.cedula);        if (e) errores.push(e); }
    const eN = validarNombreCompleto(datos.nombreCompleto);             if (eN) errores.push(eN);
    const eD = validarDireccion(datos.direccion);                       if (eD) errores.push(eD);
    const eT = validarTelefono(datos.telefono);                         if (eT) errores.push(eT);
    const eC = validarCorreo(datos.correo);                             if (eC) errores.push(eC);
    return errores;
}

// ─── Servicio ────────────────────────────────────────────────────────────────
class ClienteServicio {

    constructor() {
        clienteRepositorio.inicializarTabla()
            .then(() => console.log("✅ Tabla 'clientes' lista"))
            .catch(err => console.error("❌ Error al inicializar tabla clientes:", err.message));
    }

    async listar() {
        return await clienteRepositorio.listarTodos();
    }

    async buscarPorCedula(cedula) {
        const err = validarCedula(cedula);
        if (err) throw new Error(err);
        const cliente = await clienteRepositorio.buscarPorCedula(cedula.trim());
        if (!cliente) throw new Error("Cliente no encontrado");
        return cliente;
    }

    async crear(datos) {
        const errores = validarCampos(datos, true);
        if (errores.length > 0) throw new Error(errores.join(" | "));

        const { cedula, nombreCompleto, direccion, telefono, correo } = datos;

        if (await clienteRepositorio.existeCedula(cedula.trim()))
            throw new Error("Ya existe un cliente con esa cédula");
        if (await clienteRepositorio.existeCorreo(correo.trim()))
            throw new Error("El correo electrónico ya está en uso");

        return await clienteRepositorio.crear(
            cedula.trim(), nombreCompleto.trim(),
            direccion.trim(), telefono.trim(), correo.trim()
        );
    }

    async actualizar(cedula, datos) {
        const errCedula = validarCedula(cedula);
        if (errCedula) throw new Error(errCedula);

        const errores = validarCampos({ ...datos, cedula }, false);
        if (errores.length > 0) throw new Error(errores.join(" | "));

        const existente = await clienteRepositorio.buscarPorCedula(cedula.trim());
        if (!existente) throw new Error("Cliente no encontrado");

        const { nombreCompleto, direccion, telefono, correo } = datos;

        if (await clienteRepositorio.existeCorreo(correo.trim(), cedula.trim()))
            throw new Error("El correo electrónico ya está en uso por otro cliente");

        return await clienteRepositorio.actualizar(
            cedula.trim(), nombreCompleto.trim(),
            direccion.trim(), telefono.trim(), correo.trim()
        );
    }

    async eliminar(cedula) {
        const errCedula = validarCedula(cedula);
        if (errCedula) throw new Error(errCedula);

        const existente = await clienteRepositorio.buscarPorCedula(cedula.trim());
        if (!existente) throw new Error("Cliente no encontrado");

        const eliminado = await clienteRepositorio.eliminar(cedula.trim());
        if (!eliminado) throw new Error("No se pudo eliminar el cliente");
    }
}

module.exports = new ClienteServicio();