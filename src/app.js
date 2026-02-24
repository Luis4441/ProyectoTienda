const express = require("express");
const path = require("path");
const authRutas = require("./rutas/authRutas");
const inicializarBD = require("./config/inicializarBD");

const app = express();

// ── Middlewares ──
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ── Archivos estáticos ──
app.use(express.static(path.join(__dirname, "publico")));

// ── Vistas ──
app.get("/", (req, res) => {
    res.redirect("/login");
});

app.get("/login", (req, res) => {
    res.sendFile(path.join(__dirname, "vistas", "login.html"));
});

app.get("/dashboard", (req, res) => {
    res.sendFile(path.join(__dirname, "vistas", "dashboard.html"));
});

// ── Rutas API ──
app.use("/api/auth", authRutas);

// ── Manejo de rutas no encontradas ──
app.use((req, res) => {
    res.status(404).json({ error: "Ruta no encontrada" });
});

// ── Manejo global de errores ──
app.use((err, req, res, next) => {
    console.error("Error no controlado:", err.stack);
    res.status(500).json({ error: "Error interno del servidor" });
});

// ── Inicializar BD y arrancar servidor ──
const PUERTO = process.env.PORT || 3000;

inicializarBD().then(() => {
    app.listen(PUERTO, () => {
        console.log(`Servidor ejecutándose en http://localhost:${PUERTO}`);
    });
});