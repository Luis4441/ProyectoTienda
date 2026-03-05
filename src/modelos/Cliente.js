class Cliente {
    constructor(id, cedula, nombreCompleto, direccion, telefono, correo) {
        this.id = id;
        this.cedula = cedula;
        this.nombreCompleto = nombreCompleto;
        this.direccion = direccion;
        this.telefono = telefono;
        this.correo = correo;
    }
}

module.exports = Cliente;
