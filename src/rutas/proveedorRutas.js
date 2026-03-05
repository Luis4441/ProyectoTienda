const express = require("express");
const router = express.Router();
const proveedorControlador = require("../controladores/ProveedorControlador");

// HU-010: Crear proveedor
router.post("/", (req, res) => proveedorControlador.crear(req, res));

// HU-011: Consultar por NIT
router.get("/nit/:nit", (req, res) => proveedorControlador.buscarPorNit(req, res));

// Listar todos
router.get("/", (req, res) => proveedorControlador.listar(req, res));

// HU-012: Actualizar por NIT
router.put("/:nit", (req, res) => proveedorControlador.actualizar(req, res));

// HU-013: Eliminar por NIT
router.delete("/:nit", (req, res) => proveedorControlador.eliminar(req, res));

module.exports = router;