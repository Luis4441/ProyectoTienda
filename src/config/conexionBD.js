const { Pool } = require("pg");

const pool = new Pool({
    user: "postgres",
    host: "localhost",
    database: "tienda",
    password: "POSLUIS",
    port: 5432,
});

module.exports = pool;