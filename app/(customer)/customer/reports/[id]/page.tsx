import PageHeader from "@/components/root/PageHeader";
import { redirect } from "next/navigation";
import { ReportService } from "@/servers/services/report.service";
import { User, Wrench, MapPin, Phone, Building2, IdCard, ChevronLeft } from "lucide-react";
import Link from "next/link";
import { parseValues } from "@/lib/format";
import DetailSummaryCard from "@/components/root/detail/DetailSummaryCard";
import EvidenceSection from "@/components/root/detail/EvidenceSection";
import UsageMeter from "@/components/root/reports/UsageMeter";

export default async function CustomerReportDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const report = await ReportService.getById(Number(id));
  if (!report) redirect("/customer");

  const { current, previous } = parseValues(report.values);

  return (
    <div className="space-y-6">
      <div className="space-y-1.5">
        <Link href="/customer" className="text-muted-foreground hover:text-foreground flex items-center gap-1 text-sm transition-colors">
          <ChevronLeft className="h-4 w-4" /> Kembali
        </Link>
        <PageHeader title="Detail Laporan" subtitle="Laporan meteran air bulanan Anda" />
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
    </div>
  );
}
