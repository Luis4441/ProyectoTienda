const { Pool } = require("pg");

const pool = new Pool({
    user: "postgres",
    host: "localhost",
    database: "tienda",
    password: "40782009",
    port: 5432,
});

module.exports = pool;