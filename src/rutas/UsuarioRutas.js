const express = require("express");
const router = express.Router();
const usuarioControlador = require("../controladores/UsuarioControlador");

router.get("/",          (req, res) => usuarioControlador.listar(req, res));
router.post("/",         (req, res) => usuarioControlador.crear(req, res));
router.put("/:id",       (req, res) => usuarioControlador.actualizar(req, res));
router.delete("/:id",    (req, res) => usuarioControlador.eliminar(req, res));

module.exports = router;