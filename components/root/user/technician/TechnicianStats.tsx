"use client";

import { ArrowUpRight, ArrowDownRight, UsersIcon } from "lucide-react";

const stats = [
  {
    title: "Total Teknisi",
    value: "12,450",
    change: "15.8%",
    trend: "up",
    icon: UsersIcon,
  },
  {
    title: "Teknisi Aktif",
    value: "8,320",
    change: "5.2%",
    trend: "up",
    icon: UsersIcon,
  },
  {
    title: "Teknisi Tidak Aktif",
    value: "4,130",
    change: "2.1%",
    trend: "down",
    icon: UsersIcon,
  },
];

export default function TechnicianStats() {
  return (
    <div className="bg-border grid grid-cols-1 gap-px overflow-hidden rounded-xl border sm:grid-cols-3">
      {stats.map((stat, i) => (
        <div key={i} className="bg-card flex items-center justify-between p-4 sm:p-6">
          <div className="flex flex-1 items-center gap-4">
            <div className="bg-primary text-primary-foreground rounded-md p-2">
              <stat.icon />
            </div>
            <div className="space-y-1">
              <p className="text-muted-foreground text-xs">{stat.title}</p>
              <h3 className="text-xl font-semibold tracking-tight">
                {stat.value}
              </h3>
            </div>
          </div>

          <div
            className={`flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium ${
              stat.trend === "up"
                ? "bg-emerald-50 text-emerald-600"
                : "bg-red-50 text-red-600"
            }`}
          >
            {stat.trend === "up" ? (
              <ArrowUpRight size={14} />
            ) : (
              <ArrowDownRight size={14} />
            )}
            {stat.change}
          </div>
        </div>
      ))}
    </div>
  );
}
