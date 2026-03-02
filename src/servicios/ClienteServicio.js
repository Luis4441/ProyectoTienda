const clienteRepositorio = require("../repositorios/ClienteRepositorio");

class ClienteServicio {

    constructor() {
        clienteRepositorio.inicializarTabla()
            .then(() => console.log(" Tabla 'clientes' lista"))
            .catch(err => console.error(" Error al inicializar tabla clientes:", err.message));
    }

    // ── LISTAR ──
    async listar() {
        return await clienteRepositorio.listarTodos();
    }

    // ── BUSCAR POR CÉDULA ──
    async buscarPorCedula(cedula) {
        if (!cedula) throw new Error("La cédula es requerida");

        const cliente = await clienteRepositorio.buscarPorCedula(cedula);
        if (!cliente) throw new Error("Cliente no encontrado");

        return cliente;
    }

    // ── CREAR ──
    async crear(datos) {
        const { cedula, nombreCompleto, direccion, telefono, correo } = datos;

        if (!cedula || !nombreCompleto || !direccion || !telefono || !correo) {
            throw new Error("Todos los campos son requeridos");
        }

        if (await clienteRepositorio.existeCedula(cedula)) {
            throw new Error("Ya existe un cliente con esa cédula");
        }

        if (await clienteRepositorio.existeCorreo(correo)) {
            throw new Error("El correo electrónico ya está en uso");
        }

        return await clienteRepositorio.crear(cedula, nombreCompleto, direccion, telefono, correo);
    }

    // ── ACTUALIZAR (previa consulta por cédula) ──
    async actualizar(cedula, datos) {
        const { nombreCompleto, direccion, telefono, correo } = datos;

        if (!cedula) throw new Error("La cédula es requerida");

        if (!nombreCompleto || !direccion || !telefono || !correo) {
            throw new Error("Todos los campos son requeridos");
        }

        const existente = await clienteRepositorio.buscarPorCedula(cedula);
        if (!existente) throw new Error("Cliente no encontrado");

        if (await clienteRepositorio.existeCorreo(correo, cedula)) {
            throw new Error("El correo electrónico ya está en uso por otro cliente");
        }

        return await clienteRepositorio.actualizar(cedula, nombreCompleto, direccion, telefono, correo);
    }

    // ── ELIMINAR (previa consulta por cédula) ──
    async eliminar(cedula) {
        if (!cedula) throw new Error("La cédula es requerida");

        const existente = await clienteRepositorio.buscarPorCedula(cedula);
        if (!existente) throw new Error("Cliente no encontrado");

        const eliminado = await clienteRepositorio.eliminar(cedula);
        if (!eliminado) throw new Error("No se pudo eliminar el cliente");
    }
}

module.exports = new ClienteServicio();