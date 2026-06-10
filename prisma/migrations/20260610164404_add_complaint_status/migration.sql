-- CreateEnum
CREATE TYPE "ComplaintStatus" AS ENUM ('PENDING', 'FINISHED', 'REJECTED');

-- AlterTable
ALTER TABLE "Complaint" ADD COLUMN     "rejectionReason" TEXT,
ADD COLUMN     "resolvedAt" TIMESTAMP(3),
ADD COLUMN     "status" "ComplaintStatus" NOT NULL DEFAULT 'PENDING';
