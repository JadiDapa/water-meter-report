import PageHeader from "@/components/root/PageHeader";
import DynamicBreadcrumb from "@/components/root/DynamicBreadcrumb";
import { redirect } from "next/navigation";
import { ComplaintService } from "@/servers/services/complaint.service";
import { User, Wrench, MapPin, Phone, Building2, IdCard, FileText } from "lucide-react";
import { ComplaintStatus } from "@/generated/prisma";
import ResolveComplaintDialog from "@/components/root/complaints/ResolveComplaintDialog";
import DetailSummaryCard from "@/components/root/detail/DetailSummaryCard";
import EvidenceSection from "@/components/root/detail/EvidenceSection";
import ComplaintStatusBadge from "@/components/root/complaints/ComplaintStatusBadge";
import ComplaintResolution from "@/components/root/complaints/ComplaintResolution";

export default async function TechnicianComplaintDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const complaint = await ComplaintService.getById(Number(id));
  if (!complaint) redirect("/technician/my-complaints");

  return (
    <main className="min-h-screen w-full space-y-6 md:rounded-2xl">
      <div className="space-y-1.5">
        <DynamicBreadcrumb />
        <PageHeader title="Detail Keluhan" subtitle="Keluhan pelanggan meteran air" />
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
              { icon: IdCard, value: complaint.technician.technicianId },
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

      <ComplaintResolution
        status={complaint.status}
        cancellationReason={complaint.cancellationReason}
        resolvedAt={complaint.resolvedAt}
      />

      {/* Technician resolve actions — only shown while still pending */}
      {complaint.status === ComplaintStatus.PENDING && (
        <div className="bg-card border-border flex flex-wrap items-center justify-between gap-4 rounded-xl border p-5">
          <div>
            <p className="text-sm font-semibold">Tindakan</p>
            <p className="text-muted-foreground text-xs">Selesaikan atau batalkan keluhan ini</p>
          </div>
          <ResolveComplaintDialog complaintId={complaint.id} />
        </div>
      )}

      <EvidenceSection images={complaint.images} />
    </main>
  );
}
