const express = require("express");
const path = require("path");
const authRutas = require("./rutas/authRutas");

const app = express();

// ── Middlewares ──
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ── Log de rutas para diagnóstico ──
console.log("📁 __dirname:", __dirname);
console.log("📄 Ruta login.html:", path.join(__dirname, "vistas", "login.html"));
console.log("📄 Ruta dashboard.html:", path.join(__dirname, "vistas", "dashboard.html"));

// ── Archivos estáticos (CSS, JS, imágenes si los hubiera) ──
app.use(express.static(path.join(__dirname, "publico")));

// ── Vistas ──
app.get("/", (req, res) => {
    res.redirect("/login");
});

app.get("/login", (req, res) => {
    const rutaLogin = path.join(__dirname, "vistas", "login.html");
    console.log("🌐 Sirviendo login desde:", rutaLogin);
    res.sendFile(rutaLogin);
});

app.get("/dashboard", (req, res) => {
    const rutaDashboard = path.join(__dirname, "vistas", "dashboard.html");
    console.log("🌐 Sirviendo dashboard desde:", rutaDashboard);
    res.sendFile(rutaDashboard);
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

// ── Inicio del servidor ──
const PUERTO = process.env.PORT || 3000;
app.listen(PUERTO, () => {
    console.log(`Servidor ejecutándose en http://localhost:${PUERTO}`);
});