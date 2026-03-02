class Proveedor {
    constructor(id, nit, nombreProveedor, direccion, telefono, ciudad) {
        this.id = id;
        this.nit = nit;
        this.nombreProveedor = nombreProveedor;
        this.direccion = direccion;
        this.telefono = telefono;
        this.ciudad = ciudad;
    }
}

module.exports = Proveedor;