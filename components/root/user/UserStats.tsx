"use client";

import { User } from "@/generated/prisma";
import { UsersIcon } from "lucide-react";

export default function UserStats({ users }: { users: User[] }) {
  const stats = [
    {
      title: "Total Pengguna",
      value: users.length.toString(),
      icon: UsersIcon,
    },
    {
      title: "Total Admin",
      value: users.filter((user) => user.role === "ADMIN").length.toString(),
      icon: UsersIcon,
    },
    {
      title: "Total Teknisi",
      value: users
        .filter((user) => user.role === "TECHNICIAN")
        .length.toString(),
      icon: UsersIcon,
    },
    {
      title: "Total Pelanggan",
      value: users.filter((user) => user.role === "CUSTOMER").length.toString(),
      icon: UsersIcon,
    },
  ];

  return (
    // 2 cols on mobile → 4 cols on sm+
    <div className="bg-border grid grid-cols-2 overflow-hidden rounded-xl border gap-px sm:grid-cols-4">
      {stats.map((stat, i) => (
        <div key={i} className="bg-card flex items-center gap-4 p-4 sm:p-6">
          <div className="bg-primary text-primary-foreground rounded-md p-2 shrink-0">
            <stat.icon className="h-5 w-5" />
          </div>
          <div className="space-y-1 min-w-0">
            <p className="text-muted-foreground text-xs truncate">{stat.title}</p>
            <h3 className="text-xl font-semibold tracking-tight">{stat.value}</h3>
          </div>
        </div>
      ))}
    </div>
  );
}
