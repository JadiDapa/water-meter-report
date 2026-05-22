import PageHeader from "@/components/root/PageHeader";
import { getCurrentUser } from "@/app/actions/user.actions";
import { TechnicianService } from "@/servers/services/technician.service";
import { ReportService } from "@/servers/services/report.service";
import { ComplaintService } from "@/servers/services/complaint.service";
import ReportStats from "@/components/root/reports/ReportStats";
import ComplaintStats from "@/components/root/complaints/ComplaintStats";

export default async function TechnicianDashboardPage() {
  const user = await getCurrentUser();
  const technician = await TechnicianService.getByUserId(user.id);
  const [reports, complaints] = technician
    ? await Promise.all([
        ReportService.getByTechnicianId(technician.id),
        ComplaintService.getByTechnicianId(technician.id),
      ])
    : [[], []];

  return (
    <main className="min-h-screen w-full space-y-8">
      <div className="flex flex-col items-center justify-between lg:flex-row">
        <PageHeader
          title={`Selamat Datang, ${user.name}!`}
          subtitle="Pantau laporan dan keluhan Anda dari sini."
        />
      </div>

      <div className="space-y-4">
        <h2 className="text-foreground text-lg font-medium">Statistik Laporan</h2>
        <ReportStats reports={reports} />
      </div>

      <div className="space-y-4">
        <h2 className="text-foreground text-lg font-medium">Statistik Keluhan</h2>
        <ComplaintStats complaints={complaints} />
      </div>
    </main>
  );
}
