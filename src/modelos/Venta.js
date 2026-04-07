class Venta {
    constructor(id, codigoVenta, cedulaCliente, cedulaUsuario, valorTotal, valorIva, totalConIva, fecha) {
        this.id           = id;
        this.codigoVenta  = codigoVenta;
        this.cedulaCliente = cedulaCliente;
        this.cedulaUsuario = cedulaUsuario;
        this.valorTotal   = valorTotal;
        this.valorIva     = valorIva;
        this.totalConIva  = totalConIva;
        this.fecha        = fecha;
    }
}

module.exports = Venta;