import PageHeader from "@/components/root/PageHeader";
import { redirect } from "next/navigation";
import { ComplaintService } from "@/servers/services/complaint.service";
import Image from "next/image";
import { User, Wrench, MapPin, Calendar, ImageIcon, ChevronLeft } from "lucide-react";
import Link from "next/link";

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
      <p className="text-sm">Tidak ada foto bukti</p>
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
          <span className="absolute right-2 bottom-2 rounded-md bg-black/50 px-1.5 py-0.5 text-[11px] font-medium text-white opacity-0 backdrop-blur-sm transition group-hover:opacity-100">Lihat</span>
        </a>
      ))}
    </div>
  );
}

export default async function CustomerComplaintDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const complaint = await ComplaintService.getById(Number(id));
  if (!complaint) redirect("/customer");

  return (
    <div className="space-y-6">
      <div className="flex flex-col items-start justify-between gap-4 lg:flex-row lg:items-center">
        <div className="space-y-1.5">
          <Link href="/customer" className="text-muted-foreground hover:text-foreground flex items-center gap-1 text-sm transition-colors">
            <ChevronLeft className="h-4 w-4" /> Kembali
          </Link>
          <PageHeader title="Detail Keluhan" subtitle="Keluhan meteran air Anda" />
        </div>
        <div className="bg-background border-border flex items-center gap-2 rounded-xl border px-4 py-2.5 shadow-sm">
          <Calendar className="h-4 w-4" />
          <span className="text-sm text-neutral-500">{formatDate(complaint.createdAt)}</span>
          <span className="ml-1 rounded-md bg-neutral-100 px-1.5 py-0.5 text-xs font-semibold text-neutral-500 dark:bg-neutral-800">#{complaint.id}</span>
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

      <div className="bg-background border-border space-y-4 rounded-xl border p-5 ring-1 ring-neutral-200 dark:ring-neutral-700">
        <div className="flex items-center gap-2.5">
          <div className="rounded-lg bg-neutral-100 p-2.5 dark:bg-neutral-800"><ImageIcon className="h-5 w-5 text-neutral-500" /></div>
          <div>
            <p className="text-xs font-medium tracking-widest uppercase">Bukti Foto</p>
            <p className="text-[13px] font-medium text-neutral-500">{complaint.images.length} gambar terlampir</p>
          </div>
        </div>
        <EvidenceGallery images={complaint.images} />
      </div>
    </div>
  );
}
