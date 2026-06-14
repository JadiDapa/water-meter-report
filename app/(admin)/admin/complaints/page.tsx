import PageHeader from "@/components/root/PageHeader";
import { ComplaintService } from "@/servers/services/complaint.service";
import DynamicBreadcrumb from "@/components/root/DynamicBreadcrumb";
import ComplaintStats from "@/components/root/complaints/ComplaintStats";
import ComplaintTable from "@/components/root/complaints/ComplaintTable";
import MonthYearFilter from "@/components/root/MonthYearFilter";
import {
  parseMonthYear,
  filterByMonthYear,
  getAvailableYears,
} from "@/lib/format";

export default async function AdminComplaintsPage({
  searchParams,
}: {
  searchParams: Promise<{ month?: string; year?: string }>;
}) {
  const params = await searchParams;
  const { month, year } = parseMonthYear(params.month, params.year);

  const allComplaints = await ComplaintService.getAll();
  const years = getAvailableYears(allComplaints);
  const complaints = filterByMonthYear(allComplaints, { month, year });

  return (
    <main className="min-h-screen w-full space-y-6 md:rounded-2xl">
      <div className="flex flex-col items-start gap-4 justify-between lg:flex-row lg:items-center">
        <div className="space-y-2">
          <DynamicBreadcrumb />
          <PageHeader title="Daftar Keluhan" subtitle="Semua keluhan pelanggan" />
        </div>
        <MonthYearFilter month={month} year={year} years={years} />
      </div>

      <ComplaintStats complaints={complaints} />

      <div className="space-y-2">
        <h2 className="text-foreground text-xl font-medium tracking-tight">
          Daftar Keluhan
        </h2>
        <ComplaintTable complaints={complaints} basePath="/admin/complaints" showActions />
      </div>
    </main>
  );
}
