"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("../src/generated/prisma/client");
const adapter_pg_1 = require("@prisma/adapter-pg");
const prisma = new client_1.PrismaClient({
    adapter: new adapter_pg_1.PrismaPg({
        connectionString: process.env.DATABASE_URL
    })
});
async function seed() {
    await prisma.pharmacie.deleteMany({});
    await prisma.pharmacie.createMany({
        data: [
            {
                nom: "Pharmacie Koulouba",
                telephone: "25311918",
                groupeGarde: 1,
                secteur: "Koulouba",
                description: "9F8R+M52, Ave Houari Boumedienne, Koulouba",
                latitude: 12.366632,
                longitude: -1.509611
            },
            {
                nom: "Pharmacie Desa",
                telephone: "25475050",
                groupeGarde: 3,
                secteur: "Tanghin",
                description: "Sur la route du barrage en allant vers CIPHRA",
                latitude: 12.392796,
                longitude: -1.524657
            },
            {
                nom: "Pharmacie LANZANE",
                telephone: "25471065",
                groupeGarde: 4,
                secteur: "Zone I",
                description: "Vers l'Ecole Manegda, Zone I, Ouagadougou",
                latitude: 12.363351,
                longitude: -1.464348
            },
            {
                nom: "Pharmacie de l´Hippodrome Sarl",
                telephone: "25340232",
                groupeGarde: 2,
                secteur: "Nonsin",
                description: "Juste Après le siège de MPP a Nossin",
                latitude: 12.375820,
                longitude: -1.557653
            },
            {
                nom: "Pharmacie du Rivage",
                telephone: "25341939",
                groupeGarde: 1,
                secteur: "Gounghin",
                description: "Sur la voie de l'echangeur de Gounghin (Avenue Kadiogo)",
                latitude: 12.354019,
                longitude: -1.552429
            }
        ]
    });
    console.log("Les 5 pharmacies de Ouagadougou ont été insérées dans la base cloud !");
}
seed()
    .catch((e) => console.error(e))
    .finally(async () => await prisma.$disconnect());
