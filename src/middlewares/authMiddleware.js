const jwt = require("jsonwebtoken");

function verificarToken(req, res, next) {
    const authHeader = req.headers["authorization"];

    if (!authHeader) {
        return res.status(403).json({ error: "Token requerido" });
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
        return res.status(403).json({ error: "Token inválido" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || "secreto");
        req.usuario = decoded;
        next();
    } catch (error) {
        // ← AGREGA ESTO TEMPORALMENTE
        console.error("❌ JWT Error:", error.name, error.message);
        console.error("❌ Token recibido:", token);
        console.error("❌ Secret usado:", process.env.JWT_SECRET || "secreto");
        return res.status(401).json({ error: "Token inválido o expirado" });
    }
}

module.exports = verificarToken;