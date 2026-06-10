import PageHeader from "@/components/root/PageHeader";
import DynamicBreadcrumb from "@/components/root/DynamicBreadcrumb";
import { redirect } from "next/navigation";
import { ComplaintService } from "@/servers/services/complaint.service";
import Image from "next/image";
import { User, Wrench, MapPin, Calendar, ImageIcon, XCircle, CheckCircle, Clock } from "lucide-react";
import { ComplaintStatus } from "@/generated/prisma";
import ResolveComplaintDialog from "@/components/root/complaints/ResolveComplaintDialog";

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit",
  }).format(new Date(date));
}

function InfoCard({ icon: Icon, label, name, username }: { icon: React.ElementType; label: string; name: string; username: string }) {
  return (
    <div className="bg-background border-border flex items-start gap-4 rounded-xl border p-5 ring-1">
      <div className="rounded-lg p-2.5"><Icon className="h-5 w-5" /></div>
      <div className="min-w-0 flex-1">
        <p className="mb-1 text-xs font-medium tracking-widest uppercase">{label}</p>
        <p className="truncate text-[15px] font-semibold">{name}</p>
        <span className="mt-1 inline-block rounded-md px-2 py-0.5 text-xs font-medium">@{username}</span>
      </div>
    </div>
  );
}

function EvidenceGallery({ images }: { images: { url: string }[] }) {
  if (!images.length) return (
    <div className="border-border flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed py-16">
      <ImageIcon className="h-9 w-9 text-neutral-300" />
      <p className="text-sm">No evidence images attached</p>
    </div>
  );
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
      {images.map((img, i) => (
        <a key={i} href={img.url} target="_blank" rel="noopener noreferrer"
          className="group border-border relative aspect-square overflow-hidden rounded-xl border bg-neutral-100 ring-1 ring-neutral-200 transition hover:ring-sky-400 dark:bg-neutral-800 dark:ring-neutral-700">
          <Image src={img.url} alt={`Evidence ${i + 1}`} fill unoptimized
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 25vw" />
          <div className="absolute inset-0 bg-black/0 transition group-hover:bg-black/20" />
          <span className="absolute right-2 bottom-2 rounded-md bg-black/50 px-1.5 py-0.5 text-[11px] font-medium text-white opacity-0 backdrop-blur-sm transition group-hover:opacity-100">View</span>
        </a>
      ))}
    </div>
  );
}

const statusConfig = {
  [ComplaintStatus.PENDING]: {
    label: "Menunggu",
    icon: Clock,
    className: "bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-400 dark:border-yellow-800",
  },
  [ComplaintStatus.FINISHED]: {
    label: "Selesai",
    icon: CheckCircle,
    className: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800",
  },
  [ComplaintStatus.CANCELLED]: {
    label: "Dibatalkan",
    icon: XCircle,
    className: "bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800",
  },
} as const;

export default async function TechnicianComplaintDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const complaint = await ComplaintService.getById(Number(id));
  if (!complaint) redirect("/technician/my-complaints");

  const status = statusConfig[complaint.status];
  const StatusIcon = status.icon;

  return (
    <main className="min-h-screen w-full space-y-6 md:rounded-2xl">
      <div className="flex flex-col items-start justify-between gap-4 lg:flex-row lg:items-center">
        <div className="space-y-1.5">
          <DynamicBreadcrumb />
          <PageHeader title="Detail Keluhan" subtitle="Keluhan pelanggan meteran air" />
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <div className={`flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-medium ${status.className}`}>
            <StatusIcon className="h-4 w-4" />
            {status.label}
          </div>
          <div className="bg-background border-border flex items-center gap-2 rounded-xl border px-4 py-2.5 shadow-sm">
            <Calendar className="h-4 w-4" />
            <span className="text-sm text-neutral-500">{formatDate(complaint.createdAt)}</span>
            <span className="ml-1 rounded-md bg-neutral-100 px-1.5 py-0.5 text-xs font-semibold text-neutral-500 dark:bg-neutral-800">#{complaint.id}</span>
          </div>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <InfoCard icon={Wrench} label="Teknisi" name={complaint.technician.fullname} username={complaint.technician.user.username} />
        <InfoCard icon={User} label="Pelanggan" name={complaint.customer.fullname} username={complaint.customer.user.username} />
      </div>

      <div className="flex w-full flex-col gap-4 sm:flex-row sm:gap-6">
        <div className="bg-background border-border flex flex-1 items-start gap-4 rounded-xl border p-5 ring-1 sm:flex-2">
          <div>
            <p className="mb-1 text-xs font-medium tracking-widest uppercase">Judul</p>
            <p className="text-[15px] font-semibold">{complaint.title}</p>
          </div>
        </div>
        <div className="bg-background border-border flex flex-1 items-start gap-4 rounded-xl border p-5 ring-1">
          <div className="rounded-lg p-2.5"><MapPin className="h-5 w-5" /></div>
          <div>
            <p className="mb-1 text-xs font-medium tracking-widest uppercase">Lokasi</p>
            <p className="text-[15px] font-semibold">{complaint.location}</p>
          </div>
        </div>
      </div>

      <div className="bg-background border-border flex items-start gap-4 rounded-xl border p-5 ring-1">
        <div>
          <p className="mb-1 text-xs font-medium tracking-widest uppercase">Deskripsi</p>
          <p className="text-[15px] font-semibold">{complaint.description}</p>
        </div>
      </div>

      {/* Cancellation reason */}
      {complaint.status === ComplaintStatus.CANCELLED && complaint.cancellationReason && (
        <div className="flex items-start gap-4 rounded-xl border border-red-200 bg-red-50 p-5 dark:border-red-800 dark:bg-red-900/20">
          <XCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-600 dark:text-red-400" />
          <div>
            <p className="mb-1 text-xs font-medium tracking-widest text-red-700 uppercase dark:text-red-400">
              Alasan Pembatalan
            </p>
            <p className="text-[15px] font-semibold text-red-800 dark:text-red-300">
              {complaint.cancellationReason}
            </p>
          </div>
        </div>
      )}

      {/* Resolved at */}
      {complaint.resolvedAt && (
        <div className="bg-background border-border flex items-center gap-3 rounded-xl border px-5 py-3">
          <Calendar className="h-4 w-4 text-neutral-400" />
          <span className="text-xs text-neutral-500">
            {complaint.status === ComplaintStatus.FINISHED ? "Diselesaikan" : "Dibatalkan"} pada{" "}
            <span className="font-semibold">{formatDate(complaint.resolvedAt)}</span>
          </span>
        </div>
      )}

      {/* Technician resolve actions — only shown while still pending */}
      {complaint.status === ComplaintStatus.PENDING && (
        <div className="bg-background border-border flex flex-wrap items-center justify-between gap-4 rounded-xl border p-5">
          <div>
            <p className="text-sm font-semibold">Tindakan</p>
            <p className="text-muted-foreground text-xs">Selesaikan atau batalkan keluhan ini</p>
          </div>
          <ResolveComplaintDialog complaintId={complaint.id} />
        </div>
      )}

      <div className="bg-background border-border space-y-4 rounded-xl border p-5 ring-1 ring-neutral-200 dark:ring-neutral-700">
        <div className="flex items-center gap-2.5">
          <div className="rounded-lg bg-neutral-100 p-2.5 dark:bg-neutral-800"><ImageIcon className="h-5 w-5 text-neutral-500" /></div>
          <div>
            <p className="text-xs font-medium tracking-widest uppercase">Bukti</p>
            <p className="text-[13px] font-medium text-neutral-500">{complaint.images.length} gambar terlampir</p>
          </div>
        </div>
        <EvidenceGallery images={complaint.images} />
      </div>
    </main>
  );
}
