-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "names" TEXT NOT NULL,
    "lastNames" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "departments" TEXT NOT NULL,
    "directions" TEXT NOT NULL,
    "jobNumber" TEXT NOT NULL,
    "contact" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "User_id_key" ON "User"("id");
