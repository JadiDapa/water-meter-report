import { ComplaintType } from "@/servers/validators/complaint.validator";
import {
  MapPin,
  Wrench,
  Calendar,
  ArrowRight,
  AlertCircle,
} from "lucide-react";
import { format } from "date-fns";
import { id as localeId } from "date-fns/locale";
import Link from "next/link";

export default function PendingComplaintBanner({
  complaint,
}: {
  complaint: ComplaintType;
}) {
  return (
    <Link href={`/customer/complaints/${complaint.id}`} className="group block">
      <div className="relative overflow-hidden rounded-2xl border-2 border-amber-400 bg-amber-50 p-6 shadow-md transition-all hover:shadow-lg dark:border-amber-500 dark:bg-amber-950/30">
        <div className="relative flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          {/* Left: status + title */}
          <div className="flex-1 space-y-3">
            <div className="flex items-center gap-2">
              <span className="flex items-center gap-1.5 rounded-full bg-amber-500 px-3 py-1 text-xs font-semibold text-white shadow-sm">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-white" />
                </span>
                Menunggu Penanganan
              </span>
              <span className="text-xs font-medium text-amber-700 dark:text-amber-400">
                #{complaint.id}
              </span>
            </div>

            <div>
              <p className="text-xs font-medium tracking-widest text-amber-700/70 uppercase dark:text-amber-400/70">
                Keluhan Aktif
              </p>
              <h3 className="mt-1 text-xl font-bold text-amber-900 dark:text-amber-100">
                {complaint.title}
              </h3>
              {complaint.description && (
                <p className="mt-1.5 line-clamp-2 text-sm text-amber-800/70 dark:text-amber-200/60">
                  {complaint.description}
                </p>
              )}
            </div>

            <div className="flex flex-wrap gap-4 text-sm text-amber-800 dark:text-amber-300">
              <span className="flex items-center gap-1.5">
                <MapPin className="h-4 w-4 shrink-0" />
                {complaint.location}
              </span>
              <span className="flex items-center gap-1.5">
                <Wrench className="h-4 w-4 shrink-0" />
                {complaint.technician.fullname}
              </span>
              <span className="flex items-center gap-1.5">
                <Calendar className="h-4 w-4 shrink-0" />
                {format(new Date(complaint.createdAt), "d MMM yyyy", {
                  locale: localeId,
                })}
              </span>
            </div>
          </div>

          {/* Right: icon + cta */}
          <div className="flex items-center gap-3 sm:flex-col sm:items-end sm:justify-between">
            <div className="rounded-xl bg-amber-400/20 p-3 dark:bg-amber-500/20">
              <AlertCircle className="h-7 w-7 text-amber-600 dark:text-amber-400" />
            </div>
            <span className="flex items-center gap-1 text-sm font-semibold text-amber-700 transition-all group-hover:gap-2 dark:text-amber-400">
              Lihat Detail
              <ArrowRight className="h-4 w-4" />
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
