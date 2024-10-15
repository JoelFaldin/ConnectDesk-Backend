-- CreateTable
CREATE TABLE "Departments" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Departments_id_key" ON "Departments"("id");
