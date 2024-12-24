/*
  Warnings:

  - You are about to drop the column `TagId` on the `Post` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Post" DROP CONSTRAINT "Post_TagId_fkey";

-- AlterTable
ALTER TABLE "Post" DROP COLUMN "TagId";

-- CreateTable
CREATE TABLE "_PostTag" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_PostTag_AB_unique" ON "_PostTag"("A", "B");

-- CreateIndex
CREATE INDEX "_PostTag_B_index" ON "_PostTag"("B");

-- AddForeignKey
ALTER TABLE "_PostTag" ADD CONSTRAINT "_PostTag_A_fkey" FOREIGN KEY ("A") REFERENCES "Post"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PostTag" ADD CONSTRAINT "_PostTag_B_fkey" FOREIGN KEY ("B") REFERENCES "Tag"("id") ON DELETE CASCADE ON UPDATE CASCADE;
