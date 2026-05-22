"use server";

import { revalidatePath } from "next/cache";
import { UpdateComplaintSchema } from "@/servers/validators/complaint.validator";
import { ComplaintService } from "@/servers/services/complaint.service";
import z from "zod";
import { CreateComplaintSchema } from "@/servers/validators/complaint.validator";

export async function createComplaint(formData: FormData) {
  const data = CreateComplaintSchema.parse({
    technicianId: formData.get("technicianId"),
    customerId: formData.get("customerId"),
    location: formData.get("location"),
    title: formData.get("title"),
    description: formData.get("description"),
  });

  const images = formData
    .getAll("images")
    .filter((f) => f instanceof File && f.size > 0) as File[];

  await ComplaintService.create(data, images);
  revalidatePath("/admin/complaints");
  revalidatePath("/technician/my-complaints");
}

export async function updateComplaint(
  complaintId: number,
  input: z.input<typeof UpdateComplaintSchema>,
) {
  const data = UpdateComplaintSchema.parse(input);

  await ComplaintService.update(complaintId, {
    ...data,
  });

  revalidatePath("/admin/complaints");
  revalidatePath("/technician/my-complaints");
}

export async function deleteComplaint(complaintId: number) {
  await ComplaintService.delete(complaintId);
  revalidatePath("/admin/complaints");
  revalidatePath("/technician/my-complaints");
}
