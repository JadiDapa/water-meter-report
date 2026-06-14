import PageHeader from "@/components/root/PageHeader";
import { ReportService } from "@/servers/services/report.service";
import DynamicBreadcrumb from "@/components/root/DynamicBreadcrumb";
import ReportStats from "@/components/root/reports/ReportStats";
import ReportTable from "@/components/root/reports/ReportsTable";
import { getCurrentUser } from "@/app/actions/user.actions";
import { TechnicianService } from "@/servers/services/technician.service";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import MonthYearFilter from "@/components/root/MonthYearFilter";
import ExportReportButton from "@/components/root/reports/ExportReportButton";
import {
  parseMonthYear,
  filterByMonthYear,
  getAvailableYears,
} from "@/lib/format";

export default async function TechnicianMyReportsPage({
  searchParams,
}: {
  searchParams: Promise<{ month?: string; year?: string }>;
}) {
  const params = await searchParams;
  const { month, year } = parseMonthYear(params.month, params.year);

  const user = await getCurrentUser();
  const technician = await TechnicianService.getByUserId(user.id);
  const allReports = technician
    ? await ReportService.getByTechnicianId(technician.id)
    : [];
  const years = getAvailableYears(allReports);
  const reports = filterByMonthYear(allReports, { month, year });

  return (
    <main className="min-h-screen w-full space-y-6 md:rounded-2xl">
      <div className="flex flex-col items-start gap-4 justify-between lg:flex-row lg:items-center">
        <div className="space-y-2">
          <DynamicBreadcrumb />
          <PageHeader title="Laporan Saya" subtitle="Semua laporan yang Anda buat" />
        </div>
        <div className="flex w-full flex-col items-stretch gap-3 sm:w-auto sm:flex-row sm:items-center">
          <MonthYearFilter month={month} year={year} years={years} />
          <ExportReportButton reports={reports} month={month} year={year} />
          <Link href="/technician/my-reports/create" className="w-full sm:w-auto">
            <Button className="flex w-full cursor-pointer items-center justify-center gap-2 px-6 sm:w-auto">
              <p className="text-lg font-semibold">Tambah Laporan</p>
              <Plus className="size-5" />
            </Button>
          </Link>
        </div>
      </div>

      <ReportStats reports={reports} />

      <div className="space-y-2">
        <h2 className="text-foreground text-xl font-medium tracking-tight">
          Daftar Laporan
        </h2>
        <ReportTable reports={reports} basePath="/technician/my-reports" showActions />
      </div>
    </main>
  );
}
