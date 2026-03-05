class Producto {
    constructor(id, codigoProducto, nombreProducto, nitProveedor, precioCompra, ivaCompra, precioVenta) {
        this.id = id;
        this.codigoProducto = codigoProducto;
        this.nombreProducto = nombreProducto;
        this.nitProveedor   = nitProveedor;
        this.precioCompra   = precioCompra;
        this.ivaCompra      = ivaCompra;
        this.precioVenta    = precioVenta;
    }
}

module.exports = Producto;