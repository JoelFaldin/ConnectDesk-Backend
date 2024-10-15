/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `Departments` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Departments_name_key" ON "Departments"("name");
