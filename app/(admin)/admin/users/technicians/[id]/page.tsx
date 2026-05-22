import DynamicBreadcrumb from "@/components/root/DynamicBreadcrumb";
import PageHeader from "@/components/root/PageHeader";
import { ComplaintService } from "@/servers/services/complaint.service";
import { TechnicianService } from "@/servers/services/technician.service";
import { ReportService } from "@/servers/services/report.service";
import ReportTable from "@/components/root/reports/ReportsTable";
import ComplaintTable from "@/components/root/complaints/ComplaintTable";
import TechnicianStats from "@/components/root/user/technician/TechnicianStats";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function AdminTechnicianDetailPage({ params }: PageProps) {
  const { id } = await params;
  const technician = await TechnicianService.getById(Number(id));
  const reports = await ReportService.getByTechnicianId(Number(id));
  const complaints = await ComplaintService.getByTechnicianId(Number(id));

  return (
    <main className="min-h-screen w-full space-y-8 md:rounded-2xl">
      <div className="flex flex-col items-center justify-between lg:flex-row">
        <div className="space-y-2">
          <DynamicBreadcrumb />
          <PageHeader
            title={`Teknisi: ${technician?.fullname}`}
            subtitle="Riwayat laporan dan keluhan teknisi"
          />
        </div>
      </div>

      <TechnicianStats technician={technician} />

      <div>
        <h2 className="mb-2 text-foreground text-lg font-semibold">Laporan Terbaru</h2>
        <ReportTable reports={reports} basePath="/admin/reports" />
      </div>

      <div>
        <h2 className="mb-2 text-foreground text-lg font-semibold">Keluhan Terbaru</h2>
        <ComplaintTable complaints={complaints} basePath="/admin/complaints" />
      </div>
    </main>
  );
}
