const bcrypt = require("bcrypt");
const pool = require("./conexionBD");

async function inicializarBD() {
    try {
        // Crear tabla con todos los campos (incluye los nuevos)
        await pool.query(`
            CREATE TABLE IF NOT EXISTS usuarios (
                                                    id               SERIAL PRIMARY KEY,
                                                    cedula           VARCHAR(20)  UNIQUE,
                nombre_completo  VARCHAR(100),
                nombre_usuario   VARCHAR(50)  UNIQUE NOT NULL,
                correo           VARCHAR(100) UNIQUE,
                contrasena       VARCHAR(255) NOT NULL,
                rol              VARCHAR(20)  NOT NULL DEFAULT 'ADMIN'
                )
        `);

        // Agregar columnas nuevas si la tabla ya existía sin ellas
        await pool.query(`
            ALTER TABLE usuarios
                ADD COLUMN IF NOT EXISTS cedula          VARCHAR(20)  UNIQUE,
                ADD COLUMN IF NOT EXISTS nombre_completo VARCHAR(100),
                ADD COLUMN IF NOT EXISTS correo          VARCHAR(100) UNIQUE
        `);

        // Verificar si el admin inicial existe
        const resultado = await pool.query(
            "SELECT id FROM usuarios WHERE nombre_usuario = $1",
            ["admininicial"]
        );

        if (resultado.rows.length === 0) {
            const hash = await bcrypt.hash("admin123456", 10);
            await pool.query(
                `INSERT INTO usuarios (nombre_usuario, contrasena, rol)
                 VALUES ($1, $2, $3)`,
                ["admininicial", hash, "ADMIN"]
            );
            console.log("✅ Usuario administrador inicial creado correctamente");
        } else {
            console.log("✅ Usuario administrador inicial ya existe");
        }

    } catch (error) {
        console.error("❌ Error inicializando la base de datos:", error.message);
        process.exit(1);
    }
}

module.exports = inicializarBD;