"use server";

import { revalidatePath } from "next/cache";
import {
  CreateCustomerSchema,
  UpdateCustomerSchema,
} from "@/servers/validators/customer.validator";
import { CustomerService } from "@/servers/services/customer.service";
import { UserService } from "@/servers/services/user.service";
import z from "zod";
import { clerkClient } from "@clerk/nextjs/server";

export async function createCustomer(
  input: z.input<typeof CreateCustomerSchema>,
) {
  const data = CreateCustomerSchema.parse(input);

  // Clerk usernames must contain at least one non-numeric character
  const clerkUsername = `p_${data.phoneNumber}`;

  const clerk = await clerkClient();
  const clerkUser = await clerk.users.createUser({
    username: clerkUsername,
    password: data.customerId,
    firstName: data.fullname,
  });

  let dbUserId: number | null = null;

  try {
    const dbUser = await UserService.create({
      username: clerkUsername,
      role: "CUSTOMER",
      name: data.fullname,
    });
    dbUserId = dbUser.id;

    await CustomerService.create({ ...data, userId: dbUser.id });
  } catch (err) {
    await clerk.users.deleteUser(clerkUser.id).catch(() => {});
    if (dbUserId) {
      await UserService.delete(dbUserId).catch(() => {});
    }
    throw err;
  }

  revalidatePath("/admin/users/customers");
  revalidatePath("/technician/customers");
}

export async function updateCustomer(
  customerId: number,
  input: z.input<typeof UpdateCustomerSchema>,
) {
  const data = UpdateCustomerSchema.parse(input);

  await CustomerService.update(customerId, {
    ...data,
  });

  revalidatePath("/admin/users/customers");
  revalidatePath("/technician/customers");
}

export async function deleteCustomer(customerId: number) {
  await CustomerService.delete(customerId);
  revalidatePath("/admin/users/customers");
  revalidatePath("/technician/customers");
}

// ── Import types ──────────────────────────────────────────────────────────────

export type ImportCustomerRow = {
  customerId: string;
  fullname: string;
  phoneNumber: string;
  address: string;
  buildingSlug: string;
};

export type ImportCustomerResult = {
  success: number;
  failed: { row: number; reason: string }[];
};

export async function importCustomers(
  rows: ImportCustomerRow[],
): Promise<ImportCustomerResult> {
  const result: ImportCustomerResult = { success: 0, failed: [] };

  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    let clerkUserId: string | null = null;
    let dbUserId: number | null = null;

    try {
      const data = CreateCustomerSchema.parse({
        customerId: row.customerId,
        fullname: row.fullname,
        phoneNumber: row.phoneNumber,
        address: row.address,
        buildingSlug: row.buildingSlug,
      });

      const clerkUsername = `p_${data.phoneNumber}`;

      const clerk = await clerkClient();
      const clerkUser = await clerk.users.createUser({
        username: clerkUsername,
        password: data.customerId,
        firstName: data.fullname,
      });
      clerkUserId = clerkUser.id;

      const dbUser = await UserService.create({
        username: clerkUsername,
        role: "CUSTOMER",
        name: data.fullname,
      });
      dbUserId = dbUser.id;

      await CustomerService.create({ ...data, userId: dbUser.id });

      result.success++;
    } catch (error) {
      if (clerkUserId) {
        const clerk = await clerkClient();
        await clerk.users.deleteUser(clerkUserId).catch(() => {});
      }
      if (dbUserId) {
        await UserService.delete(dbUserId).catch(() => {});
      }

      let reason = "Gagal mengimpor baris";
      if (error instanceof z.ZodError) {
        reason = error.errors[0]?.message ?? reason;
      } else if (error instanceof Error) {
        reason = error.message;
      }

      result.failed.push({ row: i + 1, reason });
    }
  }

  revalidatePath("/admin/users/customers");
  revalidatePath("/technician/customers");
  return result;
}
