const ReporteRepositorio = require("../repositorios/ReporteRepositorio");

class ReporteServicio {

    async listarUsuarios() {
        return await ReporteRepositorio.listarUsuarios();
    }

    async listarClientes() {
        return await ReporteRepositorio.listarClientes();
    }

    async ventasPorCliente() {
        return await ReporteRepositorio.ventasPorCliente();
    }
}

module.exports = new ReporteServicio();