/*
  Warnings:

  - You are about to drop the column `userId` on the `todos` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `todos` DROP FOREIGN KEY `todos_userId_fkey`;

-- AlterTable
ALTER TABLE `todos` DROP COLUMN `userId`;
