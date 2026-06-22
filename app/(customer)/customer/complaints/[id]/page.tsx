import PageHeader from "@/components/root/PageHeader";
import { redirect } from "next/navigation";
import { ComplaintService } from "@/servers/services/complaint.service";
import { User, Wrench, MapPin, Phone, Building2, IdCard, FileText, ChevronLeft } from "lucide-react";
import Link from "next/link";
import DetailSummaryCard from "@/components/root/detail/DetailSummaryCard";
import EvidenceSection from "@/components/root/detail/EvidenceSection";
import ComplaintStatusBadge from "@/components/root/complaints/ComplaintStatusBadge";

export default async function CustomerComplaintDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const complaint = await ComplaintService.getById(Number(id));
  if (!complaint) redirect("/customer");

  return (
    <div className="space-y-6">
      <div className="space-y-1.5">
        <Link href="/customer" className="text-muted-foreground hover:text-foreground flex items-center gap-1 text-sm transition-colors">
          <ChevronLeft className="h-4 w-4" /> Kembali
        </Link>
        <PageHeader title="Detail Keluhan" subtitle="Keluhan meteran air Anda" />
      </div>

      <DetailSummaryCard
        eyebrow="Keluhan"
        title={complaint.title}
        badge={<ComplaintStatusBadge status={complaint.status} />}
        id={complaint.id}
        date={complaint.createdAt}
        people={[
          {
            label: "Teknisi",
            icon: Wrench,
            name: complaint.technician.fullname,
            username: complaint.technician.user.username,
            meta: [
              { icon: Phone, value: complaint.technician.phoneNumber },
              ...(complaint.technician.region
                ? [{ icon: MapPin, value: complaint.technician.region }]
                : []),
            ],
          },
          {
            label: "Pelanggan",
            icon: User,
            name: complaint.customer.fullname,
            username: complaint.customer.user.username,
            meta: [
              { icon: Phone, value: complaint.customer.phoneNumber },
              { icon: MapPin, value: complaint.customer.address },
              { icon: Building2, value: complaint.customer.bulding.name },
              { icon: IdCard, value: complaint.customer.customerId },
            ],
          },
        ]}
        fields={[
          { icon: MapPin, label: "Lokasi", value: complaint.location },
          {
            icon: FileText,
            label: "Deskripsi",
            value: complaint.description,
            full: true,
          },
        ]}
      />

      <EvidenceSection
        images={complaint.images.filter((img) => img.kind === "INITIAL")}
        title="Bukti Keluhan"
      />
      <EvidenceSection
        images={complaint.images.filter((img) => img.kind === "RESOLUTION")}
        title="Bukti Penyelesaian"
        hideWhenEmpty
      />
    </div>
  );
}
