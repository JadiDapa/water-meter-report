-- Add technicianId as nullable first to handle existing rows
ALTER TABLE "Technician" ADD COLUMN "technicianId" TEXT;

-- Backfill existing rows with a placeholder derived from their id
UPDATE "Technician" SET "technicianId" = 'TEK-' || LPAD(id::TEXT, 3, '0') WHERE "technicianId" IS NULL;

-- Now enforce NOT NULL and UNIQUE
ALTER TABLE "Technician" ALTER COLUMN "technicianId" SET NOT NULL;
CREATE UNIQUE INDEX "Technician_technicianId_key" ON "Technician"("technicianId");
