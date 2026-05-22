import PageHeader from "@/components/root/PageHeader";
import DynamicBreadcrumb from "@/components/root/DynamicBreadcrumb";
import { redirect } from "next/navigation";
import { ReportService } from "@/servers/services/report.service";
import Image from "next/image";
import {
  User, Wrench, MapPin, Droplets, TrendingUp, TrendingDown,
  Minus, Calendar, ImageIcon, ArrowUpRight, ArrowDownRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

function parseValues(raw: string): { current: number; previous: number } {
  try {
    const parsed = JSON.parse(raw);
    if (typeof parsed === "object" && "current" in parsed) return parsed;
    if (typeof parsed === "number") return { current: parsed, previous: 0 };
  } catch {
    const n = parseFloat(raw);
    if (!isNaN(n)) return { current: n, previous: 0 };
  }
  return { current: 0, previous: 0 };
}

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit",
  }).format(new Date(date));
}

function InfoCard({ icon: Icon, label, name, username, accent }: { icon: React.ElementType; label: string; name: string; username: string; accent: "blue" | "violet" }) {
  const colors = {
    blue: { ring: "ring-blue-200 dark:ring-blue-800", iconBg: "bg-blue-50 dark:bg-blue-950", icon: "text-blue-600 dark:text-blue-400", badge: "bg-blue-50 text-blue-700 ring-1 ring-blue-200 dark:bg-blue-950 dark:text-blue-300 dark:ring-blue-800" },
    violet: { ring: "ring-violet-200 dark:ring-violet-800", iconBg: "bg-violet-50 dark:bg-violet-950", icon: "text-violet-600 dark:text-violet-400", badge: "bg-violet-50 text-violet-700 ring-1 ring-violet-200 dark:bg-violet-950 dark:text-violet-300 dark:ring-violet-800" },
  };
  const c = colors[accent];
  return (
    <div className={cn("flex items-start gap-4 rounded-xl border bg-white p-5 ring-1 dark:bg-neutral-900", c.ring)}>
      <div className={cn("rounded-lg p-2.5", c.iconBg)}><Icon className={cn("h-5 w-5", c.icon)} /></div>
      <div className="min-w-0 flex-1">
        <p className="mb-1 text-xs font-medium tracking-widest text-neutral-400 uppercase">{label}</p>
        <p className="truncate text-[15px] font-semibold text-neutral-800 dark:text-neutral-100">{name}</p>
        <span className={cn("mt-1 inline-block rounded-md px-2 py-0.5 text-xs font-medium", c.badge)}>@{username}</span>
      </div>
    </div>
  );
}

function UsageMeter({ current, previous }: { current: number; previous: number }) {
  const diff = current - previous;
  const pct = previous > 0 ? Math.round(Math.abs((diff / previous) * 100)) : null;
  const isUp = diff > 0;
  const isEqual = diff === 0;
  const TrendIcon = isEqual ? Minus : isUp ? TrendingUp : TrendingDown;
  const trendColor = isEqual ? "text-neutral-500" : isUp ? "text-rose-500" : "text-emerald-500";
  const trendBg = isEqual ? "bg-neutral-100 dark:bg-neutral-800" : isUp ? "bg-rose-50 dark:bg-rose-950" : "bg-emerald-50 dark:bg-emerald-950";
  const maxVal = Math.max(current, previous, 1);
  return (
    <div className="rounded-xl border bg-white p-5 ring-1 ring-sky-200 dark:bg-neutral-900 dark:ring-sky-800">
      <div className="mb-5 flex items-center gap-2.5">
        <div className="rounded-lg bg-sky-50 p-2.5 dark:bg-sky-950"><Droplets className="h-5 w-5 text-sky-600 dark:text-sky-400" /></div>
        <div>
          <p className="text-xs font-medium tracking-widest text-neutral-400 uppercase">Water Usage</p>
          <p className="text-[13px] font-medium text-neutral-500">Monthly meter reading</p>
        </div>
      </div>
      <div className="mb-6 flex items-end gap-3">
        <span className="text-5xl font-bold text-neutral-900 tabular-nums dark:text-white">{current.toLocaleString()}</span>
        <span className="mb-1.5 text-lg font-medium text-neutral-400">m³</span>
        {pct !== null && (
          <div className={cn("mb-1.5 flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold", trendBg, trendColor)}>
            {isUp ? <ArrowUpRight className="h-3.5 w-3.5" /> : !isEqual ? <ArrowDownRight className="h-3.5 w-3.5" /> : null}
            {isEqual ? "No change" : `${pct}% vs last month`}
          </div>
        )}
      </div>
      <div className="space-y-3">
        <div>
          <div className="mb-1 flex items-center justify-between text-[13px]">
            <span className="font-medium text-neutral-700 dark:text-neutral-300">This month</span>
            <span className="font-semibold text-sky-600 tabular-nums dark:text-sky-400">{current.toLocaleString()} m³</span>
          </div>
          <div className="h-2.5 w-full overflow-hidden rounded-full bg-neutral-100 dark:bg-neutral-800">
            <div className="h-full rounded-full bg-sky-500" style={{ width: `${Math.round((current / maxVal) * 100)}%` }} />
          </div>
        </div>
        {previous > 0 && (
          <div>
            <div className="mb-1 flex items-center justify-between text-[13px]">
              <span className="font-medium text-neutral-500">Last month</span>
              <span className="font-semibold text-neutral-400 tabular-nums">{previous.toLocaleString()} m³</span>
            </div>
            <div className="h-2.5 w-full overflow-hidden rounded-full bg-neutral-100 dark:bg-neutral-800">
              <div className="h-full rounded-full bg-neutral-300 dark:bg-neutral-600" style={{ width: `${Math.round((previous / maxVal) * 100)}%` }} />
            </div>
          </div>
        )}
      </div>
      {previous > 0 && (
        <div className={cn("mt-5 flex items-center gap-2 rounded-lg px-3.5 py-2.5", isEqual ? "bg-neutral-50 dark:bg-neutral-800" : isUp ? "bg-rose-50 dark:bg-rose-950/60" : "bg-emerald-50 dark:bg-emerald-950/60")}>
          <TrendIcon className={cn("h-4 w-4 shrink-0", trendColor)} />
          <p className={cn("text-sm font-medium", trendColor)}>
            {isEqual ? "Usage unchanged from last month." : isUp ? `Usage increased by ${Math.abs(diff).toLocaleString()} m³ compared to last month.` : `Usage decreased by ${Math.abs(diff).toLocaleString()} m³ compared to last month.`}
          </p>
        </div>
      )}
    </div>
  );
}

function EvidenceGallery({ images }: { images: { url: string }[] }) {
  if (!images.length) return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed bg-neutral-50 py-16 dark:bg-neutral-900">
      <ImageIcon className="h-9 w-9 text-neutral-300" />
      <p className="text-sm text-neutral-400">No evidence images attached</p>
    </div>
  );
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
      {images.map((img, i) => (
        <a key={i} href={img.url} target="_blank" rel="noopener noreferrer"
          className="group relative aspect-square overflow-hidden rounded-xl border bg-neutral-100 ring-1 ring-neutral-200 transition hover:ring-sky-400 dark:bg-neutral-800 dark:ring-neutral-700">
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

export default async function TechnicianReportDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const report = await ReportService.getById(Number(id));
  if (!report) redirect("/technician/my-reports");

  const { current, previous } = parseValues(report.values);

  return (
    <main className="min-h-screen w-full space-y-6 md:rounded-2xl">
      <div className="flex flex-col items-start justify-between gap-4 lg:flex-row lg:items-center">
        <div className="space-y-1.5">
          <DynamicBreadcrumb />
          <PageHeader title="Detail Laporan" subtitle="Laporan meteran air bulanan" />
        </div>
        <div className="flex items-center gap-2 rounded-xl border bg-white px-4 py-2.5 shadow-sm dark:bg-neutral-900">
          <Calendar className="h-4 w-4 text-neutral-400" />
          <span className="text-sm text-neutral-500">{formatDate(report.createdAt)}</span>
          <span className="ml-1 rounded-md bg-neutral-100 px-1.5 py-0.5 text-xs font-semibold text-neutral-500 dark:bg-neutral-800">#{report.id}</span>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <InfoCard icon={Wrench} label="Teknisi" name={report.technician.fullname} username={report.technician.user.username} accent="blue" />
        <InfoCard icon={User} label="Pelanggan" name={report.customer.fullname} username={report.customer.user.username} accent="violet" />
      </div>

      <div className="flex items-start gap-4 rounded-xl border bg-white p-5 ring-1 ring-amber-200 dark:bg-neutral-900 dark:ring-amber-800">
        <div className="rounded-lg bg-amber-50 p-2.5 dark:bg-amber-950"><MapPin className="h-5 w-5 text-amber-600 dark:text-amber-400" /></div>
        <div>
          <p className="mb-1 text-xs font-medium tracking-widest text-neutral-400 uppercase">Lokasi</p>
          <p className="text-[15px] font-semibold text-neutral-800 dark:text-neutral-100">{report.location}</p>
        </div>
      </div>

      <UsageMeter current={current} previous={previous} />

      <div className="space-y-4 rounded-xl border bg-white p-5 ring-1 ring-neutral-200 dark:bg-neutral-900 dark:ring-neutral-700">
        <div className="flex items-center gap-2.5">
          <div className="rounded-lg bg-neutral-100 p-2.5 dark:bg-neutral-800"><ImageIcon className="h-5 w-5 text-neutral-500" /></div>
          <div>
            <p className="text-xs font-medium tracking-widest text-neutral-400 uppercase">Bukti</p>
            <p className="text-[13px] font-medium text-neutral-500">{report.images.length} gambar terlampir</p>
          </div>
        </div>
        <EvidenceGallery images={report.images} />
      </div>
    </main>
  );
}
