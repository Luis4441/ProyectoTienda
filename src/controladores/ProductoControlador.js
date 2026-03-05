const productoServicio = require("../servicios/ProductoServicio");
const multer = require("multer");

// Multer en memoria — solo acepta text/csv o .csv
const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB máx
    fileFilter: (req, file, cb) => {
        const esCSV =
            file.mimetype === "text/csv" ||
            file.mimetype === "application/vnd.ms-excel" ||
            file.originalname.toLowerCase().endsWith(".csv");

        if (!esCSV) {
            return cb(new Error("Solo se permiten archivos CSV (.csv)"));
        }
        cb(null, true);
    }
});

class ProductoControlador {

    // Middleware de subida (para usar en las rutas)
    get subirArchivo() {
        return upload.single("archivo");
    }

    async listar(req, res) {
        try {
            const productos = await productoServicio.listar();
            res.json(productos);
        } catch (error) {
            console.error("❌ Error al listar productos:", error.message);
            res.status(500).json({ error: "Error interno del servidor" });
        }
    }

    async cargarCSV(req, res) {
        try {
            if (!req.file) {
                return res.status(400).json({ error: "No se recibió ningún archivo" });
            }

            const contenido = req.file.buffer.toString("utf-8");
            const resultado = await productoServicio.cargarDesdeCSV(contenido);

            res.json({
                mensaje: `Se cargaron ${resultado.totalCargados} producto(s) correctamente`,
                totalCargados: resultado.totalCargados
            });
        } catch (error) {
            console.error("❌ Error al cargar CSV:", error.message);

            // Multer fileFilter error
            if (error.message.includes("Solo se permiten")) {
                return res.status(400).json({ error: error.message });
            }

            res.status(400).json({ error: error.message });
        }
    }
}

module.exports = new ProductoControlador();