import { Card } from "@/components/ui/card";
import { MapPin, Wrench, Calendar, XCircle } from "lucide-react";
import { format } from "date-fns";
import { id as localeId } from "date-fns/locale";
import { ComplaintType } from "@/servers/validators/complaint.validator";
import { ComplaintStatus } from "@/generated/prisma";
import { cn } from "@/lib/utils";

const statusConfig: Record<
  ComplaintStatus,
  { label: string; className: string }
> = {
  PENDING: {
    label: "Menunggu",
    className: "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400",
  },
  FINISHED: {
    label: "Selesai",
    className: "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400",
  },
  CANCELLED: {
    label: "Dibatalkan",
    className: "bg-red-100 text-red-600 dark:bg-red-900/40 dark:text-red-400",
  },
};

const borderColor: Record<ComplaintStatus, string> = {
  PENDING: "border-l-amber-400",
  FINISHED: "border-l-green-500",
  CANCELLED: "border-l-red-400",
};

export default function ComplaintCard({
  complaint,
}: {
  complaint: ComplaintType;
}) {
  const status = statusConfig[complaint.status];
  const border = borderColor[complaint.status];

  return (
    <Card
      className={cn(
        "space-y-3 border-l-4 p-5 transition-all hover:shadow-md",
        border,
      )}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <p className="text-muted-foreground mb-0.5 text-xs">
            Keluhan #{complaint.id}
          </p>
          <h3 className="truncate text-sm font-semibold leading-snug">
            {complaint.title}
          </h3>
        </div>
        <span
          className={cn(
            "shrink-0 rounded-full px-2.5 py-0.5 text-xs font-semibold",
            status.className,
          )}
        >
          {status.label}
        </span>
      </div>

      {/* Meta */}
      <div className="text-muted-foreground space-y-1.5 text-sm">
        <span className="flex items-center gap-2">
          <MapPin className="h-3.5 w-3.5 shrink-0" />
          <span className="truncate">{complaint.location}</span>
        </span>
        <span className="flex items-center gap-2">
          <Wrench className="h-3.5 w-3.5 shrink-0" />
          <span className="truncate">{complaint.technician.fullname}</span>
        </span>
      </div>

      {/* Cancellation reason */}
      {complaint.status === ComplaintStatus.CANCELLED &&
        complaint.cancellationReason && (
          <div className="flex items-start gap-2 rounded-lg bg-red-50 px-3 py-2 dark:bg-red-900/20">
            <XCircle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-red-500" />
            <p className="line-clamp-2 text-xs text-red-700 dark:text-red-400">
              {complaint.cancellationReason}
            </p>
          </div>
        )}

      {/* Footer */}
      <div className="text-muted-foreground flex items-center gap-1.5 border-t pt-3 text-xs">
        <Calendar className="h-3.5 w-3.5" />
        {format(new Date(complaint.createdAt), "d MMM yyyy", {
          locale: localeId,
        })}
      </div>
    </Card>
  );
}
