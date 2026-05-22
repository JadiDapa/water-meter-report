import { Card } from "@/components/ui/card";
import { ReportType } from "@/servers/validators/report.validator";
import { MapPin, User, Wrench, Image as ImageIcon } from "lucide-react";
import { format } from "date-fns";
import Image from "next/image";

export default function ReportCard({ report }: { report: ReportType }) {
  return (
    <Card className="space-y-4 p-5 transition-all duration-200 hover:shadow-md">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <h2 className="flex items-center gap-2 text-base font-semibold">
            <Wrench className="h-4 w-4" />
            Technician #{report.technicianId}
          </h2>

          <p className="text-muted-foreground flex items-center gap-2 text-sm">
            <User className="h-4 w-4" />
            Customer #{report.customerId}
          </p>
        </div>

        <span className="bg-muted rounded-md px-2 py-1 text-xs">
          #{report.id}
        </span>
      </div>

      {/* Location */}
      <div className="flex items-start gap-2 text-sm">
        <MapPin className="text-muted-foreground mt-0.5 h-4 w-4" />
        <span>{report.location}</span>
      </div>

      {/* Values */}
      <div className="bg-muted/50 rounded-md p-3 text-sm">
        <p className="mb-1 font-medium">Values</p>
        <p className="text-muted-foreground line-clamp-3">{report.values}</p>
      </div>

      {/* Images Preview */}
      {report.images && report.images.length > 0 && (
        <div className="space-y-2">
          <p className="flex items-center gap-2 text-sm font-medium">
            <ImageIcon className="h-4 w-4" />
            Images ({report.images.length})
          </p>

          <div className="flex gap-2 overflow-x-auto">
            {report.images.slice(0, 5).map((img, i) => (
              <Image
                unoptimized
                key={i}
                src={img.url}
                alt={`report-${i}`}
                width={64}
                height={64}
                className="h-16 w-16 rounded-md border object-cover"
              />
            ))}
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="text-muted-foreground flex justify-between pt-2 text-xs">
        <span>{format(new Date(report.createdAt), "dd MMM yyyy")}</span>
        <span>Updated {format(new Date(report.updatedAt), "dd MMM yyyy")}</span>
      </div>
    </Card>
  );
}
