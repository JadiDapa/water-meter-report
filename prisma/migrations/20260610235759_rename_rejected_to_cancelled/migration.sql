-- Rename enum value REJECTED to CANCELLED
ALTER TYPE "ComplaintStatus" RENAME VALUE 'REJECTED' TO 'CANCELLED';

-- Rename column rejectionReason to cancellationReason
ALTER TABLE "Complaint" RENAME COLUMN "rejectionReason" TO "cancellationReason";
