const express = require("express");
const router = express.Router();
const authControlador = require("../controladores/AuthControlador");

router.post("/login", (req, res) => authControlador.login(req, res));

module.exports = router;