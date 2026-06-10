import PageHeader from "@/components/root/PageHeader";
import { ReportService } from "@/servers/services/report.service";
import DynamicBreadcrumb from "@/components/root/DynamicBreadcrumb";
import ReportStats from "@/components/root/reports/ReportStats";
import ReportTable from "@/components/root/reports/ReportsTable";

export default async function AdminReportsPage() {
  const reports = await ReportService.getAll();

  return (
    <main className="min-h-screen w-full space-y-6 md:rounded-2xl">
      <div className="flex flex-col items-start gap-4 justify-between lg:flex-row lg:items-center">
        <div className="space-y-2">
          <DynamicBreadcrumb />
          <PageHeader title="Daftar Laporan" subtitle="Semua laporan meteran air" />
        </div>
      </div>

      <ReportStats reports={reports} />

      <div className="space-y-2">
        <h2 className="text-foreground text-xl font-medium tracking-tight">
          Daftar Laporan
        </h2>
        <ReportTable reports={reports} basePath="/admin/reports" showActions />
      </div>
    </main>
  );
}
