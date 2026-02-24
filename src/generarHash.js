const bcrypt = require("bcrypt");

async function main() {
    const hash = await bcrypt.hash("admin123456", 10);
    console.log("Hash generado:");
    console.log(hash);
}

main();