import { XCircle, Calendar } from "lucide-react";
import { ComplaintStatus } from "@/generated/prisma";
import { formatDate } from "@/lib/format";

/**
 * Renders a complaint's resolution details: the cancellation reason (when
 * cancelled) and the resolved-at timestamp. Renders nothing when neither
 * applies. Theme-only colors.
 */
export default function ComplaintResolution({
  status,
  cancellationReason,
  resolvedAt,
}: {
  status: ComplaintStatus;
  cancellationReason?: string | null;
  resolvedAt?: Date | null;
}) {
  const showCancellation =
    status === ComplaintStatus.CANCELLED && !!cancellationReason;

  if (!showCancellation && !resolvedAt) return null;

  return (
    <>
      {showCancellation && (
        <div className="bg-destructive/10 border-destructive/20 flex items-start gap-4 rounded-xl border p-5">
          <XCircle className="text-destructive mt-0.5 h-5 w-5 shrink-0" />
          <div>
            <p className="text-destructive mb-1 text-xs font-medium tracking-widest uppercase">
              Alasan Pembatalan
            </p>
            <p className="text-destructive text-[15px] font-semibold">
              {cancellationReason}
            </p>
          </div>
        </div>
      )}

      {resolvedAt && (
        <div className="bg-card border-border flex items-center gap-3 rounded-xl border px-5 py-3">
          <Calendar className="text-muted-foreground h-4 w-4" />
          <span className="text-muted-foreground text-xs">
            {status === ComplaintStatus.FINISHED ? "Diselesaikan" : "Dibatalkan"}{" "}
            pada <span className="font-semibold">{formatDate(resolvedAt)}</span>
          </span>
        </div>
      )}
    </>
  );
}
