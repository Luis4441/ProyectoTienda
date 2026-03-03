const proveedorRepositorio = require("../repositorios/ProveedorRepositorio");

// ─── Reglas de validación ────────────────────────────────────────────────────
const REGEX_NIT      = /^[0-9]{8,12}(-[0-9])?$/;
const REGEX_TELEFONO = /^[0-9+\-\s()]{7,20}$/;
const REGEX_CIUDAD   = /^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s\-'.]+$/;
const REGEX_NOMBRE   = /^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s\-'.#,&0-9]+$/;

function validarNit(nit) {
    if (!nit || typeof nit !== "string" || !nit.trim())
        return "El NIT es requerido";
    if (!REGEX_NIT.test(nit.trim()))
        return "NIT inválido. Debe tener 8–12 dígitos y opcionalmente guion + dígito verificador (ej: 900123456-1)";
    return null;
}

function validarNombreProveedor(nombre) {
    if (!nombre || typeof nombre !== "string" || !nombre.trim())
        return "El nombre del proveedor es requerido";
    const v = nombre.trim();
    if (v.length < 3)    return "El nombre debe tener al menos 3 caracteres";
    if (v.length > 120)  return "El nombre no puede superar 120 caracteres";
    if (!REGEX_NOMBRE.test(v)) return "El nombre contiene caracteres no permitidos";
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

function validarCiudad(ciudad) {
    if (!ciudad || typeof ciudad !== "string" || !ciudad.trim())
        return "La ciudad es requerida";
    const v = ciudad.trim();
    if (v.length < 2)    return "La ciudad debe tener al menos 2 caracteres";
    if (v.length > 100)  return "La ciudad no puede superar 100 caracteres";
    if (!REGEX_CIUDAD.test(v))
        return "La ciudad solo puede contener letras, espacios, guiones y apóstrofes";
    return null;
}

// Acumula todos los errores en una sola pasada
function validarCampos(datos, incluirNit = true) {
    const errores = [];
    if (incluirNit) { const e = validarNit(datos.nit);               if (e) errores.push(e); }
    const eN = validarNombreProveedor(datos.nombreProveedor);         if (eN) errores.push(eN);
    const eD = validarDireccion(datos.direccion);                     if (eD) errores.push(eD);
    const eT = validarTelefono(datos.telefono);                       if (eT) errores.push(eT);
    const eC = validarCiudad(datos.ciudad);                           if (eC) errores.push(eC);
    return errores;
}

// ─── Servicio ────────────────────────────────────────────────────────────────
class ProveedorServicio {

    constructor() {
        proveedorRepositorio.inicializarTabla()
            .then(() => console.log("✅ Tabla 'proveedores' lista"))
            .catch(err => console.error("❌ Error al inicializar tabla proveedores:", err.message));
    }

    async listar() {
        return await proveedorRepositorio.listarTodos();
    }

    async buscarPorNit(nit) {
        const err = validarNit(nit);
        if (err) throw new Error(err);

        const proveedor = await proveedorRepositorio.buscarPorNit(nit.trim());
        if (!proveedor) throw new Error("Proveedor no encontrado");
        return proveedor;
    }

    async crear(datos) {
        const errores = validarCampos(datos, true);
        if (errores.length > 0) throw new Error(errores.join(" | "));

        const { nit, nombreProveedor, direccion, telefono, ciudad } = datos;

        if (await proveedorRepositorio.existeNit(nit.trim()))
            throw new Error("Ya existe un proveedor con ese NIT");

        return await proveedorRepositorio.crear(
            nit.trim(), nombreProveedor.trim(),
            direccion.trim(), telefono.trim(), ciudad.trim()
        );
    }

    async actualizar(nit, datos) {
        const errNit = validarNit(nit);
        if (errNit) throw new Error(errNit);

        const errores = validarCampos({ ...datos, nit }, false);
        if (errores.length > 0) throw new Error(errores.join(" | "));

        const existente = await proveedorRepositorio.buscarPorNit(nit.trim());
        if (!existente) throw new Error("Proveedor no encontrado");

        const { nombreProveedor, direccion, telefono, ciudad } = datos;
        return await proveedorRepositorio.actualizar(
            nit.trim(), nombreProveedor.trim(),
            direccion.trim(), telefono.trim(), ciudad.trim()
        );
    }

    async eliminar(nit) {
        const errNit = validarNit(nit);
        if (errNit) throw new Error(errNit);

        const existente = await proveedorRepositorio.buscarPorNit(nit.trim());
        if (!existente) throw new Error("Proveedor no encontrado");

        const eliminado = await proveedorRepositorio.eliminar(nit.trim());
        if (!eliminado) throw new Error("No se pudo eliminar el proveedor");
    }
}

module.exports = new ProveedorServicio();