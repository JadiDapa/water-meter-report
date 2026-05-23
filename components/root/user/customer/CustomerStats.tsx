"use client";

import { ArrowUpRight, ArrowDownRight, UsersIcon } from "lucide-react";

interface CustomerStatsProps {
  total?: number;
  activeThisMonth?: number;
  inactiveThisMonth?: number;
}

export default function CustomerStats({
  total = 0,
  activeThisMonth = 0,
  inactiveThisMonth = 0,
}: CustomerStatsProps) {
  const stats = [
    {
      title: "Total Pelanggan",
      value: total.toString(),
      change: null,
      trend: "up" as const,
      icon: UsersIcon,
    },
    {
      title: "Aktif Bulan Ini",
      value: activeThisMonth.toString(),
      change: null,
      trend: "up" as const,
      icon: UsersIcon,
    },
    {
      title: "Tidak Aktif",
      value: inactiveThisMonth.toString(),
      change: null,
      trend: "down" as const,
      icon: UsersIcon,
    },
  ];

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

          {stat.change !== null && (
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
          )}
        </div>
      ))}
    </div>
  );
}
