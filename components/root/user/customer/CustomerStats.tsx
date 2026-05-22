"use client";

import { ArrowUpRight, ArrowDownRight, UsersIcon } from "lucide-react";

const stats = [
  {
    title: "Total Customers",
    value: "12,450",
    change: "15.8%",
    trend: "up",
    icon: UsersIcon,
  },
  {
    title: "Active Customers",
    value: "8,320",
    change: "5.2%",
    trend: "up",
    icon: UsersIcon,
  },
  {
    title: "Inactive Customers",
    value: "4,130",
    change: "2.1%",
    trend: "down",
    icon: UsersIcon,
  },
];

export default function CustomerStats() {
  return (
    <div className="bg-card flex flex-row overflow-hidden rounded-xl border px-6 py-4">
      {stats.map((stat, i) => (
        <div
          key={i}
          className={`flex flex-1 items-center justify-between p-6 ${
            i !== stats.length - 1 ? "border-r" : ""
          }`}
        >
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

          {/* Right */}
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
