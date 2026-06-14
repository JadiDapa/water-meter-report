import {
  Droplets,
  TrendingUp,
  TrendingDown,
  Minus,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Water-usage card comparing the current month's meter reading to the previous,
 * shown as three stat tiles (last month / this month / difference) plus a
 * comparison bar. Theme-only colors: an increase (the noteworthy case) uses
 * `destructive`, otherwise `primary`/`muted-foreground`.
 */
export default function UsageMeter({
  current,
  previous,
}: {
  current: number;
  previous: number;
}) {
  const diff = current - previous;
  const pct =
    previous > 0 ? Math.round(Math.abs((diff / previous) * 100)) : null;
  const isUp = diff > 0;
  const isEqual = diff === 0;
  const TrendIcon = isEqual ? Minus : isUp ? TrendingUp : TrendingDown;
  const ArrowIcon = isUp ? ArrowUpRight : ArrowDownRight;
  const trendColor = isEqual
    ? "text-muted-foreground"
    : isUp
      ? "text-destructive"
      : "text-primary";
  const maxVal = Math.max(current, previous, 1);

  return (
    <div className="bg-card ring-border overflow-hidden rounded-2xl border ring-1">
      {/* Header band */}
      <div className="border-border from-primary/10 flex items-center gap-3 border-b bg-gradient-to-r to-transparent px-6 py-5">
        <div className="bg-primary/10 rounded-lg p-2.5">
          <Droplets className="text-primary h-5 w-5" />
        </div>
        <div>
          <p className="text-muted-foreground text-[11px] font-medium tracking-widest uppercase">
            Penggunaan Air
          </p>
          <p className="text-card-foreground text-sm font-semibold">
            Pembacaan meteran bulanan
          </p>
        </div>
      </div>

      {/* Stat tiles */}
      <div className="bg-border grid gap-px sm:grid-cols-3">
        <div className="bg-card p-6">
          <p className="text-muted-foreground text-[11px] font-medium tracking-widest uppercase">
            Bulan Lalu
          </p>
          <p className="text-muted-foreground mt-2 text-3xl font-bold tabular-nums">
            {previous.toLocaleString()}
            <span className="ml-1 text-base font-medium">m³</span>
          </p>
        </div>

        <div className="bg-card p-6">
          <p className="text-muted-foreground text-[11px] font-medium tracking-widest uppercase">
            Bulan Ini
          </p>
          <p className="text-primary mt-2 text-3xl font-bold tabular-nums">
            {current.toLocaleString()}
            <span className="ml-1 text-base font-medium">m³</span>
          </p>
        </div>

        <div className="bg-card p-6">
          <p className="text-muted-foreground text-[11px] font-medium tracking-widest uppercase">
            Selisih
          </p>
          <div className="mt-2 flex items-center gap-2">
            <p className={cn("text-3xl font-bold tabular-nums", trendColor)}>
              {!isEqual && (isUp ? "+" : "−")}
              {Math.abs(diff).toLocaleString()}
              <span className="ml-1 text-base font-medium">m³</span>
            </p>
            {pct !== null && !isEqual && (
              <span
                className={cn(
                  "flex items-center gap-0.5 rounded-full px-2 py-0.5 text-xs font-semibold",
                  isUp ? "bg-destructive/10" : "bg-primary/10",
                  trendColor,
                )}
              >
                <ArrowIcon className="h-3 w-3" />
                {pct}%
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Comparison bars */}
      <div className="border-border space-y-3 border-t p-6">
        <div>
          <div className="mb-1 flex items-center justify-between text-[13px]">
            <span className="text-foreground font-medium">Bulan ini</span>
            <span className="text-primary font-semibold tabular-nums">
              {current.toLocaleString()} m³
            </span>
          </div>
          <div className="bg-muted h-2.5 w-full overflow-hidden rounded-full">
            <div
              className="bg-primary h-full rounded-full"
              style={{ width: `${Math.round((current / maxVal) * 100)}%` }}
            />
          </div>
        </div>
        {previous > 0 && (
          <div>
            <div className="mb-1 flex items-center justify-between text-[13px]">
              <span className="text-muted-foreground font-medium">
                Bulan lalu
              </span>
              <span className="text-muted-foreground font-semibold tabular-nums">
                {previous.toLocaleString()} m³
              </span>
            </div>
            <div className="bg-muted h-2.5 w-full overflow-hidden rounded-full">
              <div
                className="bg-muted-foreground/30 h-full rounded-full"
                style={{ width: `${Math.round((previous / maxVal) * 100)}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Summary line */}
      {/* {previous > 0 && (
        <div
          className={cn(
            "mx-6 mb-6 flex items-center gap-2 rounded-lg px-3.5 py-2.5",
            isEqual ? "bg-muted" : isUp ? "bg-destructive/10" : "bg-primary/10",
          )}
        >
          <TrendIcon className={cn("h-4 w-4 shrink-0", trendColor)} />
          <p className={cn("text-sm font-medium", trendColor)}>
            {isEqual
              ? "Penggunaan tidak berubah dari bulan lalu."
              : isUp
                ? `Penggunaan meningkat ${Math.abs(diff).toLocaleString()} m³ dari bulan lalu.`
                : `Penggunaan berkurang ${Math.abs(diff).toLocaleString()} m³ dari bulan lalu.`}
          </p>
        </div>
      )} */}
    </div>
  );
}
