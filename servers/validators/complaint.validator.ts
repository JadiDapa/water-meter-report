import { Prisma } from "@/generated/prisma";
import { z } from "zod";

export type ComplaintType = Prisma.ComplaintGetPayload<{
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

export const ComplaintSearchSchema = z.object({
  page: z.number().int().min(1).default(1),
  pageSize: z.number().int().min(1).max(100).default(20),
  search: z.string().min(1).max(50).optional(),
});

const ComplaintBaseSchema = z.object({
  technicianId: z.coerce.number().int().positive(),
  customerId: z.coerce.number().int().positive(),
  location: z.string().min(1),
  title: z.string().min(1),
  description: z.string().min(1),
});

export const CreateComplaintSchema = ComplaintBaseSchema.extend({});

export const UpdateComplaintSchema = ComplaintBaseSchema.partial();

export type CreateComplaintDTO = z.infer<typeof CreateComplaintSchema>;
export type UpdateComplaintDTO = z.infer<typeof UpdateComplaintSchema>;
