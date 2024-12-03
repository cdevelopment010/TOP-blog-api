/*
  Warnings:

  - Added the required column `TagId` to the `Post` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Comment" DROP CONSTRAINT "Comment_createdById_fkey";

-- DropForeignKey
ALTER TABLE "Post" DROP CONSTRAINT "Post_publishedById_fkey";

-- AlterTable
ALTER TABLE "Comment" ALTER COLUMN "createdById" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Post" ADD COLUMN     "TagId" INTEGER NOT NULL,
ALTER COLUMN "published" SET DEFAULT false,
ALTER COLUMN "publishedAt" DROP NOT NULL,
ALTER COLUMN "publishedById" DROP NOT NULL;

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "updatedAt" SET DEFAULT CURRENT_TIMESTAMP;

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_publishedById_fkey" FOREIGN KEY ("publishedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_TagId_fkey" FOREIGN KEY ("TagId") REFERENCES "Tag"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
