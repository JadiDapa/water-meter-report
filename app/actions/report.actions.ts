"use server";

import { revalidatePath } from "next/cache";
import {
  CreateReportSchema,
  UpdateReportSchema,
} from "@/servers/validators/report.validator";
import { ReportService } from "@/servers/services/report.service";
import z from "zod";

export async function createReport(formData: FormData) {
  const data = CreateReportSchema.parse({
    technicianId: formData.get("technicianId"),
    customerId: formData.get("customerId"),
    location: formData.get("location"),
    values: formData.get("values"),
  });

  const images = formData
    .getAll("images")
    .filter((f) => f instanceof File && f.size > 0) as File[];

  await ReportService.create(data, images);
  revalidatePath("/admin/reports");
  revalidatePath("/technician/my-reports");
}

export async function updateReport(
  reportId: number,
  input: z.input<typeof UpdateReportSchema>,
) {
  const data = UpdateReportSchema.parse(input);

  await ReportService.update(reportId, {
    ...data,
  });

  revalidatePath("/admin/reports");
  revalidatePath("/technician/my-reports");
}

export async function deleteReport(reportId: number) {
  await ReportService.delete(reportId);
  revalidatePath("/admin/reports");
  revalidatePath("/technician/my-reports");
}
