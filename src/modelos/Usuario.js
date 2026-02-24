class Usuario {
    constructor(id, cedula, nombreCompleto, nombreUsuario, correo, contrasena, rol) {
        this.id = id;
        this.cedula = cedula;
        this.nombreCompleto = nombreCompleto;
        this.nombreUsuario = nombreUsuario;
        this.correo = correo;
        this.contrasena = contrasena;
        this.rol = rol;
    }
}

module.exports = Usuario;