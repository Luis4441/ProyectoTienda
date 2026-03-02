const express = require("express");
const path = require("path");
const authRutas = require("./rutas/authRutas");
const usuarioRutas = require("./rutas/usuarioRutas");
const inicializarBD = require("./config/inicializarBD");
const clienteRutas = require('./rutas/clienteRutas');


const app = express();

// ── Middlewares ──
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const verificarToken = require("./middlewares/authMiddleware");

// ── Archivos estáticos ──
app.use(express.static(path.join(__dirname, "publico")));

// ── Vistas ──
app.get("/", (req, res) => res.redirect("/login"));
app.get("/login",     (req, res) => res.sendFile(path.join(__dirname, "vistas", "login.html")));
app.get("/dashboard", (req, res) => res.sendFile(path.join(__dirname, "vistas", "dashboard.html")));
app.get("/clientes", (req, res) => res.sendFile(path.join(__dirname, "vistas", "clientes.html")));

// ── Rutas API ──
app.use("/api/auth",     authRutas);
app.use("/api/usuarios", usuarioRutas);
app.use('/api/clientes', verificarToken, clienteRutas);

// ── 404 ──
app.use((req, res) => res.status(404).json({ error: "Ruta no encontrada" }));

// ── Error global ──
app.use((err, req, res, next) => {
    console.error("Error no controlado:", err.stack);
    res.status(500).json({ error: "Error interno del servidor" });
});


// ── Inicializar BD y arrancar ──
const PUERTO = process.env.PORT || 3000;
inicializarBD().then(() => {
    app.listen(PUERTO, () => {
        console.log(`Servidor ejecutándose en http://localhost:${PUERTO}`);
    });
});