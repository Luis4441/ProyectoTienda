const express = require("express");
const router = express.Router();
const ReporteControlador = require("../controladores/ReporteControlador");

router.get("/usuarios",          (req, res) => ReporteControlador.listarUsuarios(req, res));
router.get("/clientes",          (req, res) => ReporteControlador.listarClientes(req, res));
router.get("/ventas-por-cliente",(req, res) => ReporteControlador.ventasPorCliente(req, res));

module.exports = router;