-- CreateEnum
CREATE TYPE "ImageKind" AS ENUM ('INITIAL', 'RESOLUTION');

-- AlterTable
ALTER TABLE "Image" ADD COLUMN     "kind" "ImageKind" NOT NULL DEFAULT 'INITIAL';
