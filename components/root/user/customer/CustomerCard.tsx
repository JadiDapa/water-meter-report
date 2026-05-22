import { Card } from "@/components/ui/card";
import { CustomerType } from "@/servers/validators/customer.validator";
import { User, Phone, MapPin, Building2 } from "lucide-react";
import { format } from "date-fns";
import Link from "next/link";

export default function CustomerCard({ customer }: { customer: CustomerType }) {
  return (
    <Link href={`/customers/${customer.id}`}>
      <Card className="bg-background hover:bg-muted/40 w-full rounded-lg border px-3 py-2 transition-colors">
        <div className="flex items-center justify-between gap-3 text-sm">
          {/* LEFT: Main Info */}
          <div className="flex min-w-0 flex-1 items-center gap-3">
            {/* Icon */}
            <div className="bg-primary/10 text-primary flex h-7 w-7 shrink-0 items-center justify-center rounded-md">
              <User className="h-3.5 w-3.5" />
            </div>

            {/* Name + ID */}
            <div className="min-w-0">
              <p className="truncate leading-tight font-medium">
                {customer.fullname}
              </p>
              <p className="text-muted-foreground text-[11px] leading-tight">
                #{customer.customerId}
              </p>
            </div>
          </div>

          {/* MIDDLE: Inline Info (compressed) */}
          <div className="text-muted-foreground hidden items-center gap-4 text-xs md:flex">
            <span className="flex items-center gap-1">
              <Phone className="h-3 w-3" />
              {customer.phoneNumber}
            </span>

            <span className="flex items-center gap-1">
              <Building2 className="h-3 w-3" />
              {customer.buildingSlug}
            </span>

            <span className="flex max-w-[200px] items-center gap-1 truncate">
              <MapPin className="h-3 w-3" />
              {customer.address}
            </span>
          </div>

          {/* RIGHT: Meta */}
          <div className="text-muted-foreground shrink-0 text-right text-[11px]">
            <p className="text-foreground font-medium">ID {customer.id}</p>
            <p>{format(new Date(customer.createdAt), "dd MMM yyyy")}</p>
          </div>
        </div>
      </Card>
    </Link>
  );
}
