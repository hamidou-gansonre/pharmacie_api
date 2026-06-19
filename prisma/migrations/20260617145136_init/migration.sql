-- CreateTable
CREATE TABLE "pharmacies" (
    "id" SERIAL NOT NULL,
    "nom" VARCHAR(150) NOT NULL,
    "telephone" VARCHAR(20) NOT NULL,
    "groupe_garde" INTEGER NOT NULL,
    "secteur" VARCHAR(100),
    "description_localisation" TEXT,
    "latitude" DOUBLE PRECISION NOT NULL,
    "longitude" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "pharmacies_pkey" PRIMARY KEY ("id")
);
