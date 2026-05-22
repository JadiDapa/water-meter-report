"use server";

import { revalidatePath } from "next/cache";
import {
  CreateBuildingSchema,
  UpdateBuildingSchema,
} from "@/servers/validators/building.validator";
import { BuildingService } from "@/servers/services/building.service";
import z from "zod";

export async function createBuilding(
  input: z.input<typeof CreateBuildingSchema>,
) {
  const data = CreateBuildingSchema.parse({
    slug: input.slug,
    name: input.name,
    description: input.description,
  });

  await BuildingService.create(data);

  revalidatePath("/admin/users/customers");
}

export async function updateBuilding(
  buildingId: number,
  input: z.input<typeof UpdateBuildingSchema>,
) {
  const data = UpdateBuildingSchema.parse(input);

  await BuildingService.update(buildingId, {
    ...data,
  });

  revalidatePath("/admin/users/customers");
}

export async function deleteBuilding(buildingId: number) {
  await BuildingService.delete(buildingId);
  revalidatePath("/admin/users/customers");
}
