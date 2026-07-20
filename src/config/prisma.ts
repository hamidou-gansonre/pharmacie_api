import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client";


//Verification avant toute initialisation
if (!process.env.DATABASE_URL) {
    console.error('[FATAL] DATABASE_URL is not defined in environment variables');
    process.exit(1); // Arrêt immédiat — le process manager relancera avec les bons logs
}

const prisma = new PrismaClient({
    log: process.env.NODE_ENV === 'development'
        ? ['query', 'error', 'warn'] //logs detaillés en dev
        : ['error'],
    adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL })
});


export default prisma;