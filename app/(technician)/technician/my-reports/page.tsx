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

export default async function TechnicianMyReportsPage() {
  const user = await getCurrentUser();
  const technician = await TechnicianService.getByUserId(user.id);
  const reports = technician ? await ReportService.getByTechnicianId(technician.id) : [];

  return (
    <main className="min-h-screen w-full space-y-6 md:rounded-2xl">
      <div className="flex flex-col items-center justify-between lg:flex-row">
        <div className="space-y-2">
          <DynamicBreadcrumb />
          <PageHeader title="Laporan Saya" subtitle="Semua laporan yang Anda buat" />
        </div>
        <Link href="/technician/my-reports/create">
          <Button className="flex cursor-pointer items-center gap-2 px-6">
            <p className="text-lg font-semibold">Tambah Laporan</p>
            <Plus className="size-5" />
          </Button>
        </Link>
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
