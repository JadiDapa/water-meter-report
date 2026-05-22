import { Prisma } from "@/generated/prisma";
import { z } from "zod";

export type ReportType = Prisma.ReportGetPayload<{
  include: {
    customer: {
      include: {
        user: true;
      };
    };
    images: true;
    technician: {
      include: {
        user: true;
      };
    };
  };
}>;

export const ReportSearchSchema = z.object({
  page: z.number().int().min(1).default(1),
  pageSize: z.number().int().min(1).max(100).default(20),
  search: z.string().min(1).max(50).optional(),
});

const ReportBaseSchema = z.object({
  technicianId: z.coerce.number().int().positive(),
  customerId: z.coerce.number().int().positive(),
  location: z.string().min(1),
  values: z.coerce.string(),
});

export const CreateReportSchema = ReportBaseSchema.extend({});

export const UpdateReportSchema = ReportBaseSchema.partial();

export type CreateReportDTO = z.infer<typeof CreateReportSchema>;
export type UpdateReportDTO = z.infer<typeof UpdateReportSchema>;
