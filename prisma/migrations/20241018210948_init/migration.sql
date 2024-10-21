-- CreateTable
CREATE TABLE "User" (
    "rut" TEXT NOT NULL PRIMARY KEY,
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

-- CreateTable
CREATE TABLE "Directions" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Departments" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "address" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "BlackList" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "token" TEXT NOT NULL,
    "expiration" DATETIME NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "User_rut_key" ON "User"("rut");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Directions_id_key" ON "Directions"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Departments_id_key" ON "Departments"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Departments_name_key" ON "Departments"("name");

-- CreateIndex
CREATE UNIQUE INDEX "BlackList_id_key" ON "BlackList"("id");
