"use server";

import { revalidatePath } from "next/cache";
import {
  CreateUserSchema,
  UpdateUserSchema,
} from "@/servers/validators/user.validator";
import { UserService } from "@/servers/services/user.service";
import z from "zod";
import { currentUser, clerkClient } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export async function getCurrentUser() {
  const clerkUser = await currentUser();

  if (!clerkUser?.username) {
    redirect("/sign-in");
  }

  const user = await UserService.getByUsername(clerkUser.username);

  if (!user) {
    throw new Error("User not found in database");
  }

  return user;
}

export async function createUser(input: z.input<typeof CreateUserSchema>) {
  const data = CreateUserSchema.parse(input);

  // 1. Create Clerk account
  const clerk = await clerkClient();
  const clerkUser = await clerk.users.createUser({
    username: data.username,
    password: data.password,
    firstName: data.name,
  });

  // 2. Create DB record — roll back Clerk on failure
  try {
    await UserService.create({
      username: data.username,
      role: data.role,
      name: data.name,
    });
  } catch (err) {
    await clerk.users.deleteUser(clerkUser.id).catch(() => {});
    throw err;
  }

  revalidatePath("/admin/users");
}

// ── Import types ──────────────────────────────────────────────────────────────

export type ImportRow = {
  name: string;
  username: string;
  password: string;
  role: string;
};

export type ImportResult = {
  success: number;
  failed: { row: number; reason: string }[];
};

export async function importUsers(rows: ImportRow[]): Promise<ImportResult> {
  const result: ImportResult = { success: 0, failed: [] };

  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    let clerkUserId: string | null = null;

    try {
      const data = CreateUserSchema.parse({
        name: row.name,
        username: row.username,
        password: row.password,
        role: row.role,
      });

      // Create Clerk account first
      const clerk = await clerkClient();
      const clerkUser = await clerk.users.createUser({
        username: data.username,
        password: data.password,
        firstName: data.name,
      });
      clerkUserId = clerkUser.id;

      // Create DB record
      await UserService.create({
        username: data.username,
        role: data.role,
        name: data.name,
      });

      result.success++;
    } catch (error) {
      // If DB creation failed after Clerk succeeded, clean up Clerk
      if (clerkUserId) {
        const clerk = await clerkClient();
        await clerk.users.deleteUser(clerkUserId).catch(() => {});
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

  revalidatePath("/admin/users");
  return result;
}

export async function updateUser(
  userId: number,
  input: z.input<typeof UpdateUserSchema>,
) {
  const data = UpdateUserSchema.parse(input);

  await UserService.update(userId, {
    ...data,
  });

  revalidatePath("/admin/users");
}

export async function deleteUser(userId: number) {
  await UserService.delete(userId);
  revalidatePath("/admin/users");
}
