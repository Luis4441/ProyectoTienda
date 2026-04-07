// ventaRutas.js
// Registra este archivo en tu app.js:
//   const ventaRutas = require('./rutas/ventaRutas');
//   app.use('/api/ventas', verificarToken, ventaRutas);
//
// Y agrega la ruta de la vista:
//   app.get('/ventas', verificarToken, (req, res) => res.sendFile(path.join(__dirname, 'vistas/ventas.html')));

const express = require("express");
const router  = express.Router();
const ventaControlador = require("../controladores/VentaControlador");

// Buscar cliente por cédula (paso 1 del flujo de venta)
router.get("/cliente/:cedula",  (req, res) => ventaControlador.buscarCliente(req, res));

// Buscar producto por código (agregar al carrito)
router.get("/producto/:codigo", (req, res) => ventaControlador.buscarProducto(req, res));

// Registrar venta completa (cabecera + detalle en transacción)
router.post("/",                (req, res) => ventaControlador.registrar(req, res));

// Listar todas las ventas
router.get("/",                 (req, res) => ventaControlador.listar(req, res));

// Obtener venta completa con su detalle
router.get("/:codigo",          (req, res) => ventaControlador.obtenerCompleta(req, res));

module.exports = router;