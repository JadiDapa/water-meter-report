import { Prisma } from "@/generated/prisma";
import { z } from "zod";

export type BuildingType = Prisma.BuildingGetPayload<{
  include: {
    customers: true;
  };
}>;

export const BuildingSearchSchema = z.object({
  page: z.number().int().min(1).default(1),
  pageSize: z.number().int().min(1).max(100).default(20),
  search: z.string().min(1).max(50).optional(),
});

const BuildingBaseSchema = z.object({
  slug: z.string().min(1),
  name: z.string().min(1),
  description: z.string().optional(),
});

export const CreateBuildingSchema = BuildingBaseSchema.extend({});

export const UpdateBuildingSchema = BuildingBaseSchema.partial();

export type CreateBuildingDTO = z.infer<typeof CreateBuildingSchema>;
export type UpdateBuildingDTO = z.infer<typeof UpdateBuildingSchema>;
