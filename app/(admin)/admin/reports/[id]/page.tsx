import PageHeader from "@/components/root/PageHeader";
import DynamicBreadcrumb from "@/components/root/DynamicBreadcrumb";
import { redirect } from "next/navigation";
import { ReportService } from "@/servers/services/report.service";
import { User, Wrench, MapPin, Phone, Building2, IdCard } from "lucide-react";
import { parseValues } from "@/lib/format";
import DetailSummaryCard from "@/components/root/detail/DetailSummaryCard";
import EvidenceSection from "@/components/root/detail/EvidenceSection";
import UsageMeter from "@/components/root/reports/UsageMeter";

export default async function AdminReportDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const report = await ReportService.getById(Number(id));
  if (!report) redirect("/admin/reports");

  const { current, previous } = parseValues(report.values);

  return (
    <main className="min-h-screen w-full space-y-6 md:rounded-2xl">
      <div className="space-y-1.5">
        <DynamicBreadcrumb />
        <PageHeader title="Detail Laporan" subtitle="Laporan meteran air bulanan" />
      </div>

      <DetailSummaryCard
        eyebrow="Lokasi Meteran"
        title={report.location}
        id={report.id}
        date={report.createdAt}
        people={[
          {
            label: "Teknisi",
            icon: Wrench,
            name: report.technician.fullname,
            username: report.technician.user.username,
            meta: [
              { icon: Phone, value: report.technician.phoneNumber },
              ...(report.technician.region
                ? [{ icon: MapPin, value: report.technician.region }]
                : []),
              { icon: IdCard, value: report.technician.technicianId },
            ],
          },
          {
            label: "Pelanggan",
            icon: User,
            name: report.customer.fullname,
            username: report.customer.user.username,
            meta: [
              { icon: Phone, value: report.customer.phoneNumber },
              { icon: MapPin, value: report.customer.address },
              { icon: Building2, value: report.customer.bulding.name },
              { icon: IdCard, value: report.customer.customerId },
            ],
          },
        ]}
      />

      <UsageMeter current={current} previous={previous} />

      <EvidenceSection images={report.images} />
    </main>
  );
}
