// import { Pool } from "pg";
import { PrismaClient } from "../generated/prisma";
import { CONFIG } from ".";

export const prisma = new PrismaClient();

(async () => {
    const user = await prisma.user.findFirst()
    console.log(user?.name)
})()


// const caCert = fs.readFileSync('ca.pem').toString();

// export const rawSqlPool = new Pool({
//     host: CONFIG.DB_HOST,
//     user: CONFIG.DB_USER,
//     port: Number(CONFIG.DB_PORT),
//     database: CONFIG.DB_NAME,
//     password: CONFIG.DB_PASS,
//     ssl: {
//         // ca: caCert
//         rejectUnauthorized: false
//     },
// });