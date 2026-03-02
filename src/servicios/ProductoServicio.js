const productoRepositorio = require("../repositorios/ProductoRepositorio");

class ProductoServicio {

    constructor() {
        productoRepositorio.inicializarTabla()
            .then(() => console.log(" Tabla 'productos' lista"))
            .catch(err => console.error(" Error al inicializar tabla productos:", err.message));
    }

    // ── LISTAR ──
    async listar() {
        return await productoRepositorio.listarTodos();
    }

    // ── CARGAR DESDE CSV (HU-014) ──
    /**
     * Recibe el contenido de texto del CSV, lo valida, parsea
     * y reemplaza todos los productos en la BD.
     *
     * Formato esperado (con o sin cabecera):
     *   codigo_producto,nombre_producto,nitproveedor,precio_compra,ivacompra,precio_venta
     */
    async cargarDesdeCSV(contenidoCSV) {
        if (!contenidoCSV || contenidoCSV.trim() === "") {
            throw new Error("El archivo está vacío");
        }

        // Normalizar saltos de línea y dividir en filas
        const lineas = contenidoCSV
            .replace(/\r\n/g, "\n")
            .replace(/\r/g, "\n")
            .split("\n")
            .map(l => l.trim())
            .filter(l => l.length > 0);

        if (lineas.length === 0) {
            throw new Error("El archivo no contiene datos");
        }

        // Detectar si la primera línea es cabecera
        const CABECERAS_VALIDAS = ["codigo_producto", "codigo", "code"];
        const primeraLinea = lineas[0].toLowerCase().replace(/\s/g, "");
        const tieneCabecera = CABECERAS_VALIDAS.some(c => primeraLinea.includes(c));

        const filasDatos = tieneCabecera ? lineas.slice(1) : lineas;

        if (filasDatos.length === 0) {
            throw new Error("El archivo solo contiene la cabecera, sin datos");
        }

        const productos = [];
        const errores   = [];

        filasDatos.forEach((linea, idx) => {
            const numeroFila = tieneCabecera ? idx + 2 : idx + 1;
            const campos = linea.split(",").map(c => c.trim());

            if (campos.length !== 6) {
                errores.push(`Fila ${numeroFila}: se esperan 6 columnas, se encontraron ${campos.length}`);
                return;
            }

            const [col1, col2, col3, col4, col5, col6] = campos;

            // Validar codigo_producto (BIGINT)
            const codigoProducto = Number(col1);
            if (!Number.isInteger(codigoProducto) || codigoProducto <= 0 || col1 === "") {
                errores.push(`Fila ${numeroFila}: código_producto inválido ("${col1}")`);
                return;
            }

            // Validar nombre_producto (VARCHAR 50)
            const nombreProducto = col2;
            if (!nombreProducto || nombreProducto.length > 50) {
                errores.push(`Fila ${numeroFila}: nombre_producto inválido o supera 50 caracteres`);
                return;
            }

            // Validar nitproveedor (BIGINT)
            const nitProveedor = Number(col3);
            if (!Number.isInteger(nitProveedor) || nitProveedor <= 0 || col3 === "") {
                errores.push(`Fila ${numeroFila}: nitproveedor inválido ("${col3}")`);
                return;
            }

            // Validar precios (DOUBLE)
            const precioCompra = parseFloat(col4);
            const ivaCompra    = parseFloat(col5);
            const precioVenta  = parseFloat(col6);

            if (isNaN(precioCompra) || precioCompra < 0) {
                errores.push(`Fila ${numeroFila}: precio_compra inválido ("${col4}")`);
                return;
            }
            if (isNaN(ivaCompra) || ivaCompra < 0) {
                errores.push(`Fila ${numeroFila}: ivacompra inválido ("${col5}")`);
                return;
            }
            if (isNaN(precioVenta) || precioVenta < 0) {
                errores.push(`Fila ${numeroFila}: precio_venta inválido ("${col6}")`);
                return;
            }

            productos.push({ codigoProducto, nombreProducto, nitProveedor, precioCompra, ivaCompra, precioVenta });
        });

        if (errores.length > 0) {
            throw new Error(`El archivo contiene errores:\n${errores.join("\n")}`);
        }

        if (productos.length === 0) {
            throw new Error("No se encontraron productos válidos en el archivo");
        }

        // Verificar códigos duplicados dentro del mismo CSV
        const codigos = productos.map(p => p.codigoProducto);
        const duplicados = codigos.filter((c, i) => codigos.indexOf(c) !== i);
        if (duplicados.length > 0) {
            throw new Error(`El archivo tiene códigos de producto duplicados: ${[...new Set(duplicados)].join(", ")}`);
        }

        const totalCargados = await productoRepositorio.reemplazarTodos(productos);
        return { totalCargados, productos };
    }
}

module.exports = new ProductoServicio();