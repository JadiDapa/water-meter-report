"use server";

import { revalidatePath } from "next/cache";
import {
  CreateCustomerSchema,
  UpdateCustomerSchema,
} from "@/servers/validators/customer.validator";
import { CustomerService } from "@/servers/services/customer.service";
import z from "zod";

export async function createCustomer(
  input: z.input<typeof CreateCustomerSchema>,
) {
  const data = CreateCustomerSchema.parse({
    userId: input.userId,
    customerId: input.customerId,
    fullname: input.fullname,
    phoneNumber: input.phoneNumber,
    address: input.address,
    buildingSlug: input.buildingSlug,
  });

  await CustomerService.create(data);

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
