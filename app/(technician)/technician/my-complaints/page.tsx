import PageHeader from "@/components/root/PageHeader";
import { ComplaintService } from "@/servers/services/complaint.service";
import DynamicBreadcrumb from "@/components/root/DynamicBreadcrumb";
import ComplaintStats from "@/components/root/complaints/ComplaintStats";
import ComplaintTable from "@/components/root/complaints/ComplaintTable";
import { getCurrentUser } from "@/app/actions/user.actions";
import { TechnicianService } from "@/servers/services/technician.service";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import MonthYearFilter from "@/components/root/MonthYearFilter";
import {
  parseMonthYear,
  filterByMonthYear,
  getAvailableYears,
} from "@/lib/format";

export default async function TechnicianMyComplaintsPage({
  searchParams,
}: {
  searchParams: Promise<{ month?: string; year?: string }>;
}) {
  const params = await searchParams;
  const { month, year } = parseMonthYear(params.month, params.year);

  const user = await getCurrentUser();
  const technician = await TechnicianService.getByUserId(user.id);
  const allComplaints = technician
    ? await ComplaintService.getByTechnicianId(technician.id)
    : [];
  const years = getAvailableYears(allComplaints);
  const complaints = filterByMonthYear(allComplaints, { month, year });

  return (
    <main className="min-h-screen w-full space-y-6 md:rounded-2xl">
      <div className="flex flex-col items-start gap-4 justify-between lg:flex-row lg:items-center">
        <div className="space-y-2">
          <DynamicBreadcrumb />
          <PageHeader title="Keluhan Saya" subtitle="Semua keluhan yang Anda buat" />
        </div>
        <div className="flex w-full flex-col items-stretch gap-3 sm:w-auto sm:flex-row sm:items-center">
          <MonthYearFilter month={month} year={year} years={years} />
          <Link href="/technician/my-complaints/create" className="w-full sm:w-auto">
            <Button className="flex w-full cursor-pointer items-center justify-center gap-2 px-6 sm:w-auto">
              <p className="text-lg font-semibold">Tambah Keluhan</p>
              <Plus className="size-5" />
            </Button>
          </Link>
        </div>
      </div>

      <ComplaintStats complaints={complaints} />

      <div className="space-y-2">
        <h2 className="text-foreground text-xl font-medium tracking-tight">
          Daftar Keluhan
        </h2>
        <ComplaintTable complaints={complaints} basePath="/technician/my-complaints" showActions />
      </div>
    </main>
  );
}
