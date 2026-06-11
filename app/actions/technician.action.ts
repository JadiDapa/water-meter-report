"use server";

import { revalidatePath } from "next/cache";
import {
  CreateTechnicianSchema,
  UpdateTechnicianSchema,
} from "@/servers/validators/technician.validator";
import { TechnicianService } from "@/servers/services/technician.service";
import { UserService } from "@/servers/services/user.service";
import { clerkClient } from "@clerk/nextjs/server";
import z from "zod";

export async function createTechnician(
  input: z.input<typeof CreateTechnicianSchema>,
) {
  const data = CreateTechnicianSchema.parse(input);

  const clerkUsername = `t_${data.phoneNumber}`;

  const clerk = await clerkClient();
  const clerkUser = await clerk.users.createUser({
    username: clerkUsername,
    password: data.technicianId,
    firstName: data.fullname,
  });

  let dbUserId: number | null = null;

  try {
    const dbUser = await UserService.create({
      username: clerkUsername,
      role: "TECHNICIAN",
      name: data.fullname,
    });
    dbUserId = dbUser.id;

    await TechnicianService.create({ ...data, userId: dbUser.id });
  } catch (err) {
    await clerk.users.deleteUser(clerkUser.id).catch(() => {});
    if (dbUserId) {
      await UserService.delete(dbUserId).catch(() => {});
    }
    throw err;
  }

  revalidatePath("/admin/users/technicians");
}

export async function updateTechnician(
  technicianId: number,
  input: z.input<typeof UpdateTechnicianSchema>,
) {
  const data = UpdateTechnicianSchema.parse(input);

  await TechnicianService.update(technicianId, {
    ...data,
  });

  revalidatePath("/admin/users/technicians");
}

export async function deleteTechnician(technicianId: number) {
  await TechnicianService.delete(technicianId);
  revalidatePath("/admin/users/technicians");
}
