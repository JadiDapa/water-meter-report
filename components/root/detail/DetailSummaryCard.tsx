import { Calendar } from "lucide-react";
import { formatDate } from "@/lib/format";

type PersonMeta = { icon: React.ElementType; value: string };

export type Person = {
  label: string;
  icon: React.ElementType;
  name: string;
  username: string;
  meta?: PersonMeta[];
};

export type SummaryField = {
  icon?: React.ElementType;
  label: string;
  value: React.ReactNode;
  full?: boolean;
};

function PersonBlock({ label, icon: Icon, name, username, meta }: Person) {
  return (
    <div className="flex gap-4 p-6">
      <div className="bg-primary/10 flex h-12 w-12 shrink-0 items-center justify-center rounded-full">
        <Icon className="text-primary h-6 w-6" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-muted-foreground text-[11px] font-medium tracking-widest uppercase">
          {label}
        </p>
        <p className="text-card-foreground truncate text-base font-semibold">
          {name}
        </p>
        <p className="text-primary truncate text-sm">@{username}</p>
        {meta && meta.length > 0 && (
          <div className="mt-3 space-y-1.5">
            {meta.map(({ icon: MetaIcon, value }, i) => (
              <div
                key={i}
                className="text-muted-foreground flex items-center gap-2 text-sm"
              >
                <MetaIcon className="h-3.5 w-3.5 shrink-0" />
                <span className="truncate">{value}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function DetailSummaryCard({
  eyebrow,
  title,
  badge,
  id,
  date,
  people,
  fields,
}: {
  eyebrow: string;
  title: string;
  badge?: React.ReactNode;
  id: number;
  date: Date;
  people: Person[];
  fields?: SummaryField[];
}) {
  return (
    <div className="bg-card ring-border overflow-hidden rounded-2xl border ring-1">
      {/* Header band */}
      <div className="border-border from-primary/10 flex flex-wrap items-start justify-between gap-3 border-b bg-linear-to-r to-transparent px-6 py-5">
        <div className="min-w-0">
          <p className="text-muted-foreground text-[11px] font-medium tracking-widest uppercase">
            {eyebrow}
          </p>
          <h2 className="text-card-foreground mt-1 text-xl font-bold">
            {title}
          </h2>
          <div className="text-muted-foreground mt-1.5 flex items-center gap-2 text-xs">
            <Calendar className="h-3.5 w-3.5" />
            <span>{formatDate(date)}</span>
            <span className="text-muted-foreground/40">•</span>
            <span className="font-semibold">#{id}</span>
          </div>
        </div>
        {badge}
      </div>

      {/* People */}
      <div className="bg-border grid gap-px sm:grid-cols-2">
        {people.map((person, i) => (
          <div key={i} className="bg-card">
            <PersonBlock {...person} />
          </div>
        ))}
      </div>

      {/* Fields */}
      {fields && fields.length > 0 && (
        <div className="bg-border border-border grid gap-px border-t sm:grid-cols-2">
          {fields.map(({ icon: Icon, label, value, full }, i) => (
            <div
              key={i}
              className={`bg-card flex gap-3 p-6 ${full ? "sm:col-span-2" : ""}`}
            >
              {Icon && (
                <div className="bg-primary/10 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg">
                  <Icon className="text-primary h-4 w-4" />
                </div>
              )}
              <div className="min-w-0">
                <p className="text-muted-foreground text-[11px] font-medium tracking-widest uppercase">
                  {label}
                </p>
                <p className="text-card-foreground wrap-break-words mt-0.5 text-[15px] font-medium">
                  {value}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
