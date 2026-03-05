const express = require("express");
const router  = express.Router();
const productoControlador = require("../controladores/ProductoControlador");

// Listar todos los productos
router.get("/", (req, res) => productoControlador.listar(req, res));

// HU-014: Cargar CSV (reemplaza todos los productos)
router.post(
    "/cargar-csv",
    (req, res, next) => {
        productoControlador.subirArchivo(req, res, (err) => {
            if (err) return res.status(400).json({ error: err.message });
            next();
        });
    },
    (req, res) => productoControlador.cargarCSV(req, res)
);

module.exports = router;