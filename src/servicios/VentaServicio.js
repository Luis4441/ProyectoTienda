const ventaRepositorio    = require("../repositorios/VentaRepositorio");
const clienteRepositorio  = require("../repositorios/ClienteRepositorio");
const productoRepositorio = require("../repositorios/ProductoRepositorio");

// ─── Reglas de validación ────────────────────────────────────────────────────
const REGEX_CEDULA = /^[0-9]{5,15}$/;

function validarCedula(cedula, campo = "La cédula") {
    if (!cedula || typeof cedula !== "string" || !cedula.trim())
        return `${campo} es requerida`;
    if (!REGEX_CEDULA.test(cedula.trim()))
        return `${campo} debe contener solo dígitos (5–15 números)`;
    return null;
}

function validarItems(items) {
    if (!Array.isArray(items) || items.length === 0)
        return "Debe agregar al menos un producto a la venta";

    for (let i = 0; i < items.length; i++) {
        const item = items[i];
        const n    = i + 1;

        if (!item.codigoProducto)
            return `Producto ${n}: el código es requerido`;

        const qty = Number(item.cantidad);
        if (!Number.isInteger(qty) || qty < 1)
            return `Producto ${n}: la cantidad debe ser un número entero mayor a 0`;
    }
    return null;
}

// ─── Servicio ─────────────────────────────────────────────────────────────────
class VentaServicio {

    constructor() {
        ventaRepositorio.inicializarTablas()
            .then(() => console.log("✅ Tablas 'ventas' y 'detalle_ventas' listas"))
            .catch(err => console.error("❌ Error al inicializar tablas de ventas:", err.message));
    }

    // ── Buscar cliente por cédula (para el flujo de la vista) ─────────────────
    async buscarCliente(cedula) {
        const err = validarCedula(cedula, "La cédula del cliente");
        if (err) throw new Error(err);

        const cliente = await clienteRepositorio.buscarPorCedula(cedula.trim());
        if (!cliente) throw new Error("Cliente no encontrado");
        return cliente;
    }

    // ── Buscar producto por código (para agregar al carrito) ──────────────────
    async buscarProducto(codigoProducto) {
        if (!codigoProducto)
            throw new Error("El código del producto es requerido");

        const codigo = Number(codigoProducto);
        if (!Number.isInteger(codigo) || codigo <= 0)
            throw new Error("El código del producto debe ser un número entero positivo");

        const producto = await productoRepositorio.buscarPorCodigo(codigo);
        if (!producto) throw new Error("Producto no encontrado");
        return producto;
    }

    // ── Registrar venta completa ──────────────────────────────────────────────
    async registrar(datos) {
        const { cedulaCliente, cedulaUsuario, items } = datos;

        // Validar cédulas
        const errCliente = validarCedula(cedulaCliente, "La cédula del cliente");
        if (errCliente) throw new Error(errCliente);

        const errUsuario = validarCedula(cedulaUsuario, "La cédula del usuario");
        if (errUsuario) throw new Error(errUsuario);

        // Validar estructura del carrito
        const errItems = validarItems(items);
        if (errItems) throw new Error(errItems);

        // Verificar que el cliente existe
        const clienteExiste = await clienteRepositorio.buscarPorCedula(cedulaCliente.trim());
        if (!clienteExiste) throw new Error("El cliente no existe en el sistema");

        // Verificar productos y calcular totales
        let valorTotal = 0;
        let valorIva   = 0;
        const itemsCalculados = [];

        for (let i = 0; i < items.length; i++) {
            const item    = items[i];
            const codigo  = Number(item.codigoProducto);
            const cantidad = Number(item.cantidad);

            const producto = await productoRepositorio.buscarPorCodigo(codigo);
            if (!producto) throw new Error(`Producto con código ${codigo} no encontrado`);

            const valorUnitario   = parseFloat(producto.precioVenta);
            const totalLinea      = valorUnitario * cantidad;

            // IVA calculado sobre el precio de venta × porcentaje iva_compra
            // (el enunciado dice "valor de IVA definido para cada producto")
            const ivaLinea = totalLinea * (parseFloat(producto.ivaCompra) / 100);

            valorTotal += totalLinea;
            valorIva   += ivaLinea;

            itemsCalculados.push({
                codigoProducto: codigo,
                cantidad,
                valorUnitario,
                valorTotal: totalLinea
            });
        }

        const totalConIva = valorTotal + valorIva;

        // Persistir
        const venta = await ventaRepositorio.registrar(
            cedulaCliente.trim(),
            cedulaUsuario.trim(),
            parseFloat(valorTotal.toFixed(2)),
            parseFloat(valorIva.toFixed(2)),
            parseFloat(totalConIva.toFixed(2)),
            itemsCalculados
        );

        return {
            venta,
            detalle: itemsCalculados,
            cliente: clienteExiste
        };
    }

    // ── Listar todas las ventas ───────────────────────────────────────────────
    async listar() {
        return await ventaRepositorio.listarTodas();
    }

    // ── Obtener venta completa (cabecera + detalle) ───────────────────────────
    async obtenerCompleta(codigoVenta) {
        const codigo = Number(codigoVenta);
        if (!Number.isInteger(codigo) || codigo <= 0)
            throw new Error("Código de venta inválido");

        const resultado = await ventaRepositorio.obtenerCompleta(codigo);
        if (!resultado) throw new Error("Venta no encontrada");
        return resultado;
    }
}

module.exports = new VentaServicio();