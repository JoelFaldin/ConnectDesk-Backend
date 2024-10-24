/*
  Warnings:

  - You are about to drop the column `address` on the `Departments` table. All the data in the column will be lost.
  - Added the required column `address` to the `Directions` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Departments" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL
);
INSERT INTO "new_Departments" ("id", "name") SELECT "id", "name" FROM "Departments";
DROP TABLE "Departments";
ALTER TABLE "new_Departments" RENAME TO "Departments";
CREATE UNIQUE INDEX "Departments_id_key" ON "Departments"("id");
CREATE UNIQUE INDEX "Departments_name_key" ON "Departments"("name");
CREATE TABLE "new_Directions" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "address" TEXT NOT NULL
);
INSERT INTO "new_Directions" ("id", "name") SELECT "id", "name" FROM "Directions";
DROP TABLE "Directions";
ALTER TABLE "new_Directions" RENAME TO "Directions";
CREATE UNIQUE INDEX "Directions_id_key" ON "Directions"("id");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
