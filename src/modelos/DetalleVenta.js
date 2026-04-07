class DetalleVenta {
    constructor(id, codigoVenta, codigoProducto, cantidad, valorUnitario, valorTotal) {
        this.id             = id;
        this.codigoVenta    = codigoVenta;
        this.codigoProducto = codigoProducto;
        this.cantidad       = cantidad;
        this.valorUnitario  = valorUnitario;
        this.valorTotal     = valorTotal;
    }
}

module.exports = DetalleVenta;