import { PrismaClient } from "../../src/generated/prisma/client";



export const seedPharmacies = async (prisma: PrismaClient) => {
    await prisma.pharmacie.deleteMany({});
    await prisma.pharmacie.createMany({
        data: [
            {
                nom: "Pharmacie Koulouba",
                telephone: "25311918",
                groupeGarde: 1,
                ville: "OUAGADOUGOU",
                description: "9F8R+M52, Ave Houari Boumedienne, Koulouba",
                latitude: 12.366632,
                longitude: -1.509611
            },
            {
                nom: "Pharmacie Desa",
                telephone: "25475050",
                groupeGarde: 3,
                ville: "OUAGADOUGOU",
                description: "Sur la route du barrage en allant vers CIPHRA",
                latitude: 12.392796,
                longitude: -1.524657
            },
            {
                nom: "Pharmacie LANZANE",
                telephone: "25471065",
                groupeGarde: 4,
                ville: "OUAGADOUGOU",
                description: "Vers l'Ecole Manegda, Zone I, Ouagadougou",
                latitude: 12.363351,
                longitude: -1.464348
            },
            {
                nom: "Pharmacie de l´Hippodrome Sarl",
                telephone: "25340232",
                groupeGarde: 2,
                ville: "OUAGADOUGOU",
                description: "Juste Après le siège de MPP a Nossin",
                latitude: 12.375820,
                longitude: -1.557653
            },
            {
                nom: "Pharmacie du Rivage",
                telephone: "25341939",
                groupeGarde: 1,
                ville: "OUAGADOUGOU",
                description: "Sur la voie de l'echangeur de Gounghin (Avenue Kadiogo)",
                latitude: 12.354019,
                longitude: -1.552429
            }
        ]
    });

}
