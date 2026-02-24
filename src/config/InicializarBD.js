const bcrypt = require("bcrypt");
const pool = require("./conexionBD");

async function inicializarBD() {
    try {
        // Crear tabla si no existe
        await pool.query(`
            CREATE TABLE IF NOT EXISTS usuarios (
                id SERIAL PRIMARY KEY,
                nombre_usuario VARCHAR(50) UNIQUE NOT NULL,
                contrasena VARCHAR(255) NOT NULL,
                rol VARCHAR(20) NOT NULL DEFAULT 'USUARIO'
            )
        `);

        // Verificar si ya existe el admin inicial
        const resultado = await pool.query(
            "SELECT id FROM usuarios WHERE nombre_usuario = $1",
            ["admininicial"]
        );

        if (resultado.rows.length === 0) {
            const hash = await bcrypt.hash("admin123456", 10);

            await pool.query(
                "INSERT INTO usuarios (nombre_usuario, contrasena, rol) VALUES ($1, $2, $3)",
                ["admininicial", hash, "ADMIN"]
            );

            console.log("✅ Usuario administrador inicial creado correctamente");
        } else {
            console.log("✅ Usuario administrador inicial ya existe");
        }

    } catch (error) {
        console.error("❌ Error inicializando la base de datos:", error.message);
        process.exit(1); // Detener el servidor si falla la BD
    }
}

module.exports = inicializarBD;