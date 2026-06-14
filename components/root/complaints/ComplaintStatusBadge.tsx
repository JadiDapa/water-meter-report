import { XCircle, CheckCircle, Clock } from "lucide-react";
import { ComplaintStatus } from "@/generated/prisma";

/**
 * Per-status presentation for complaints. Strict theme-only colors:
 * finished → primary, cancelled → destructive, pending → muted.
 */
export const statusConfig = {
  [ComplaintStatus.PENDING]: {
    label: "Menunggu",
    icon: Clock,
    className: "bg-muted text-muted-foreground border-border",
  },
  [ComplaintStatus.FINISHED]: {
    label: "Selesai",
    icon: CheckCircle,
    className: "bg-primary/10 text-primary border-primary/20",
  },
  [ComplaintStatus.CANCELLED]: {
    label: "Dibatalkan",
    icon: XCircle,
    className: "bg-destructive/10 text-destructive border-destructive/20",
  },
} as const;

export default function ComplaintStatusBadge({
  status,
}: {
  status: ComplaintStatus;
}) {
  const { label, icon: Icon, className } = statusConfig[status];
  return (
    <div
      className={`flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-medium ${className}`}
    >
      <Icon className="h-4 w-4" />
      {label}
    </div>
  );
}
