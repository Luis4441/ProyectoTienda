class Usuario {
    constructor(id, nombreUsuario, contrasena, rol) {
        this.id = id;
        this.nombreUsuario = nombreUsuario;
        this.contrasena = contrasena;
        this.rol = rol;
    }
}

module.exports = Usuario;