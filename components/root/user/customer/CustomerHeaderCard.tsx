import {
  User as UserIcon,
  Phone,
  MapPin,
  Building2,
  Hash,
  Calendar,
} from "lucide-react";
import { CustomerType } from "@/servers/validators/customer.validator";
import { formatDate } from "@/lib/format";

type Field = {
  icon: React.ElementType;
  label: string;
  value: React.ReactNode;
  wide?: boolean;
};

export default function CustomerHeaderCard({
  customer,
}: {
  customer: CustomerType;
}) {
  const initials = customer.fullname
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const fields: Field[] = [
    {
      icon: Hash,
      label: "ID Pelanggan",
      value: customer.customerId,
    },
    {
      icon: Phone,
      label: "Nomor Telepon",
      value: customer.phoneNumber,
    },
    {
      icon: Building2,
      label: "Bangunan",
      value: customer.bulding?.description
        ? `${customer.bulding.name} — ${customer.bulding.description}`
        : (customer.bulding?.name ?? "—"),
    },
    {
      icon: UserIcon,
      label: "Akun",
      value: `${customer.user.name} (@${customer.user.username})`,
    },
    {
      icon: MapPin,
      label: "Alamat",
      value: customer.address,
      wide: true,
    },
  ];

  return (
    <div className="bg-card border-border overflow-hidden rounded-2xl border">
      {/* Identity */}
      <div className="flex flex-col gap-5 p-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex min-w-0 items-center gap-4">
          <div className="from-primary to-primary/70 text-primary-foreground flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-linear-to-br text-xl font-bold shadow-sm">
            {initials || <UserIcon className="h-7 w-7" />}
          </div>
          <div className="min-w-0">
            <p className="text-muted-foreground text-[11px] font-medium tracking-widest uppercase">
              Pelanggan
            </p>
            <h2 className="text-card-foreground truncate text-2xl font-bold tracking-tight">
              {customer.fullname}
            </h2>
            <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1.5">
              <span className="bg-primary/10 text-primary inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold">
                <Hash className="h-3 w-3" />
                {customer.customerId}
              </span>
              <span className="text-muted-foreground inline-flex items-center gap-1 text-xs">
                <Calendar className="h-3.5 w-3.5" />
                Bergabung {formatDate(customer.createdAt)}
              </span>
            </div>
          </div>
        </div>

        {/* Metrics */}
        <div className="flex shrink-0 items-center gap-6 sm:gap-8">
          <div className="text-center">
            <p className="text-card-foreground text-3xl font-bold tabular-nums">
              {customer.reports.length}
            </p>
            <p className="text-muted-foreground text-xs font-medium">Laporan</p>
          </div>
          <div className="bg-border h-10 w-px" />
          <div className="text-center">
            <p className="text-card-foreground text-3xl font-bold tabular-nums">
              {customer.complaints.length}
            </p>
            <p className="text-muted-foreground text-xs font-medium">Keluhan</p>
          </div>
        </div>
      </div>

      {/* Details */}
      <dl className="border-border bg-muted/40 grid gap-x-8 gap-y-5 border-t px-6 py-5 sm:grid-cols-2">
        {fields.map(({ icon: Icon, label, value, wide }, i) => (
          <div
            key={i}
            className={`flex items-start gap-3 ${wide ? "sm:col-span-2" : ""}`}
          >
            <Icon className="text-primary/60 mt-0.5 h-4 w-4 shrink-0" />
            <div className="min-w-0">
              <dt className="text-muted-foreground text-xs">{label}</dt>
              <dd className="text-card-foreground wrap-break-words mt-0.5 font-medium">
                {value}
              </dd>
            </div>
          </div>
        ))}
      </dl>
    </div>
  );
}
