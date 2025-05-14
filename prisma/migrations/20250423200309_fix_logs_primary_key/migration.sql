/*
  Warnings:

  - The primary key for the `Logs` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - Added the required column `logId` to the `Logs` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Logs" (
    "logId" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "endpoint" TEXT NOT NULL,
    "method" TEXT NOT NULL,
    "statusCode" INTEGER NOT NULL,
    "description" TEXT NOT NULL,
    "date" DATETIME NOT NULL
);
INSERT INTO "new_Logs" ("date", "description", "endpoint", "method", "statusCode", "userId") SELECT "date", "description", "endpoint", "method", "statusCode", "userId" FROM "Logs";
DROP TABLE "Logs";
ALTER TABLE "new_Logs" RENAME TO "Logs";
CREATE UNIQUE INDEX "Logs_logId_key" ON "Logs"("logId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
