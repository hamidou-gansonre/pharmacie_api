import { PrismaClient } from "../src/generated/prisma/client"
import { PrismaPg } from "@prisma/adapter-pg"
import { seedPharmacies } from "./seeders/pharmacies.seeder";
import { seedUsers } from "./seeders/users.seed";

const prisma = new PrismaClient({
  adapter: new PrismaPg({
    connectionString: process.env.DATABASE_URL
  })
});

async function seed() {

  //await seedPharmacies(prisma);
  await seedUsers(prisma);

}

seed()
  .catch((e) => console.error(e))
  .finally(async () => await prisma.$disconnect());