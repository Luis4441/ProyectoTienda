const express = require("express");
const router = express.Router();
const clienteControlador = require("../controladores/ClienteControlador");

// HU-006: Crear cliente
router.post("/", (req, res) => clienteControlador.crear(req, res));

// HU-007: Consultar por cédula
router.get("/cedula/:cedula", (req, res) => clienteControlador.buscarPorCedula(req, res));

// Listar todos
router.get("/", (req, res) => clienteControlador.listar(req, res));

// HU-008: Actualizar por cédula
router.put("/:cedula", (req, res) => clienteControlador.actualizar(req, res));

// HU-009: Eliminar por cédula
router.delete("/:cedula", (req, res) => clienteControlador.eliminar(req, res));

module.exports = router;