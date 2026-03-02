const proveedorRepositorio = require("../repositorios/ProveedorRepositorio");

class ProveedorServicio {

    constructor() {
        proveedorRepositorio.inicializarTabla()
            .then(() => console.log(" Tabla 'proveedores' lista"))
            .catch(err => console.error(" Error al inicializar tabla proveedores:", err.message));
    }

    // ── LISTAR ──
    async listar() {
        return await proveedorRepositorio.listarTodos();
    }

    // ── BUSCAR POR NIT ──
    async buscarPorNit(nit) {
        if (!nit) throw new Error("El NIT es requerido");

        const proveedor = await proveedorRepositorio.buscarPorNit(nit);
        if (!proveedor) throw new Error("Proveedor no encontrado");

        return proveedor;
    }

    // ── CREAR ──
    async crear(datos) {
        const { nit, nombreProveedor, direccion, telefono, ciudad } = datos;

        if (!nit || !nombreProveedor || !direccion || !telefono || !ciudad) {
            throw new Error("Todos los campos son requeridos");
        }

        if (await proveedorRepositorio.existeNit(nit)) {
            throw new Error("Ya existe un proveedor con ese NIT");
        }

        return await proveedorRepositorio.crear(nit, nombreProveedor, direccion, telefono, ciudad);
    }

    // ── ACTUALIZAR ──
    async actualizar(nit, datos) {
        const { nombreProveedor, direccion, telefono, ciudad } = datos;

        if (!nit) throw new Error("El NIT es requerido");

        if (!nombreProveedor || !direccion || !telefono || !ciudad) {
            throw new Error("Todos los campos son requeridos");
        }

        const existente = await proveedorRepositorio.buscarPorNit(nit);
        if (!existente) throw new Error("Proveedor no encontrado");

        return await proveedorRepositorio.actualizar(nit, nombreProveedor, direccion, telefono, ciudad);
    }

    // ── ELIMINAR ──
    async eliminar(nit) {
        if (!nit) throw new Error("El NIT es requerido");

        const existente = await proveedorRepositorio.buscarPorNit(nit);
        if (!existente) throw new Error("Proveedor no encontrado");

        const eliminado = await proveedorRepositorio.eliminar(nit);
        if (!eliminado) throw new Error("No se pudo eliminar el proveedor");
    }
}

module.exports = new ProveedorServicio();