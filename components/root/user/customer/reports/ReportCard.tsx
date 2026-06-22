import { Card } from "@/components/ui/card";
import { ReportType } from "@/servers/validators/report.validator";
import {
  MapPin,
  Wrench,
  Droplets,
  TrendingUp,
  TrendingDown,
  Minus,
} from "lucide-react";
import { format } from "date-fns";
import { id as localeId } from "date-fns/locale";

export default function ReportCard({
  report,
  previousValue,
  previousUsage,
}: {
  report: ReportType;
  previousValue?: number;
  previousUsage?: number;
}) {
  const current = Number(report.values);
  // Selisih / jumlah pemakaian pada bulan terkait.
  const usage = previousValue !== undefined ? current - previousValue : null;

  // Persentase naik/turun dibanding pemakaian bulan sebelumnya.
  const percentChange =
    usage !== null && previousUsage !== undefined && previousUsage !== 0
      ? ((usage - previousUsage) / Math.abs(previousUsage)) * 100
      : null;

  const trendUp = percentChange !== null && percentChange > 0;
  const trendFlat = percentChange === 0;

  const TrendIcon = trendFlat ? Minus : trendUp ? TrendingUp : TrendingDown;
  const trendColor = trendFlat
    ? "text-muted-foreground"
    : trendUp
      ? "text-red-600 dark:text-red-400" // pemakaian naik
      : "text-green-600 dark:text-green-400"; // pemakaian turun

  return (
    <Card className="overflow-hidden transition-all duration-200 hover:shadow-md">
      {/* Month header */}
      <div className="flex items-center gap-4 bg-sky-50 px-5 py-4 dark:bg-sky-950/30">
        <div className="flex flex-col items-center rounded-xl bg-white px-3 py-2 shadow-sm ring-1 ring-sky-200 dark:bg-sky-900/40 dark:ring-sky-700">
          <span className="text-[11px] font-bold tracking-widest text-sky-600 uppercase dark:text-sky-400">
            {format(new Date(report.createdAt), "MMM", { locale: localeId })}
          </span>
          <span className="text-2xl leading-none font-extrabold text-sky-800 dark:text-sky-100">
            {format(new Date(report.createdAt), "dd")}
          </span>
          <span className="text-[10px] text-sky-500 dark:text-sky-400">
            {format(new Date(report.createdAt), "yyyy")}
          </span>
        </div>

        <div className="min-w-0 flex-1">
          <p className="text-xs font-medium tracking-widest text-sky-600/70 uppercase dark:text-sky-400/70">
            Laporan Meteran
          </p>
          <p className="text-sm font-semibold text-sky-900 dark:text-sky-100">
            {format(new Date(report.createdAt), "MMMM yyyy", {
              locale: localeId,
            })}
          </p>
          <p className="text-muted-foreground mt-0.5 text-xs">#{report.id}</p>
        </div>
      </div>

      <div className="space-y-3 p-5">
        {/* Meta */}
        <div className="text-muted-foreground space-y-1.5 text-sm">
          <span className="flex items-center gap-2">
            <Wrench className="h-3.5 w-3.5 shrink-0" />
            <span className="truncate">{report.technician.fullname}</span>
          </span>
          <span className="flex items-center gap-2">
            <MapPin className="h-3.5 w-3.5 shrink-0" />
            <span className="truncate">{report.location}</span>
          </span>
        </div>

        {/* Pemakaian bulan ini */}
        <div className="rounded-xl bg-sky-50 p-3 dark:bg-sky-950/30">
          <div className="mb-2 flex items-center gap-1.5">
            <Droplets className="h-4 w-4 text-sky-500" />
            <span className="text-xs font-semibold tracking-wide text-sky-700 uppercase dark:text-sky-400">
              Pemakaian Bulan Ini
            </span>
          </div>
          <p className="text-2xl leading-none font-extrabold text-sky-900 dark:text-sky-100">
            {usage !== null ? usage.toLocaleString("id-ID") : "—"}
            <span className="ml-1 text-base font-semibold">m³</span>
          </p>
          {percentChange !== null && (
            <div
              className={`mt-2 flex items-center gap-1 text-xs font-semibold ${trendColor}`}
            >
              <TrendIcon className="h-3.5 w-3.5" />
              <span>
                {trendFlat
                  ? "Sama dengan bulan lalu"
                  : `${trendUp ? "+" : ""}${percentChange.toFixed(1)}% dari bulan lalu`}
              </span>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}
