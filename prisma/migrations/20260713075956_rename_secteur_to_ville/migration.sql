/*
  Warnings:

  - You are about to drop the column `secteur` on the `pharmacies` table. All the data in the column will be lost.
  - Added the required column `ville` to the `pharmacies` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
-- 1. Renommer proprement la colonne sans perdre la structure
ALTER TABLE "pharmacies" RENAME COLUMN "secteur" TO "ville";

-- 2. Remplir les 243 lignes existantes qui étaient à NULL avec "OUAGADOUGOU"
UPDATE "pharmacies" SET "ville" = 'OUAGADOUGOU' WHERE "ville" IS NULL;

-- 3. Forcer la colonne à devenir obligatoire (NOT NULL) et définir sa taille à 100 caractères
ALTER TABLE "pharmacies" ALTER COLUMN "ville" TYPE VARCHAR(100), ALTER COLUMN "ville" SET NOT NULL;