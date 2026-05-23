"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Bell, Search, Gift, Info, X } from "lucide-react";
import Image from "next/image";
import { User } from "@/generated/prisma";
import { ToggleTheme } from "./ToggleTheme";
import Link from "next/link";
import { SidebarTrigger } from "@/components/ui/sidebar";

export default function DashboardNavbar({ user }: { user: User }) {
  const [searchOpen, setSearchOpen] = useState(false);

  // Mobile: full-width search takes over the navbar
  if (searchOpen) {
    return (
      <nav className="border-border bg-card sticky top-0 z-50 flex items-center gap-3 border-b px-4 py-3">
        <button
          onClick={() => setSearchOpen(false)}
          className="text-muted-foreground hover:text-foreground shrink-0 transition-colors"
        >
          <X className="h-5 w-5" />
        </button>
        <div className="border-border bg-card flex flex-1 items-center gap-2 rounded-lg border px-3 py-2">
          <Search className="text-muted-foreground h-4 w-4 shrink-0" />
          <Input
            type="text"
            placeholder="Search"
            autoFocus
            className="placeholder:text-muted-foreground h-auto border-none bg-transparent p-0 text-sm shadow-none focus-visible:ring-0"
          />
        </div>
      </nav>
    );
  }

  return (
    <nav className="border-border bg-card sticky top-0 z-50 flex items-center justify-between border-b px-4 py-3">
      {/* Left: hamburger (mobile only) + search box (desktop only) */}
      <div className="flex items-center gap-3">
        {/* Sidebar toggle — only visible on mobile */}
        <SidebarTrigger className="md:hidden" />

        {/* Search box — desktop only */}
        <div className="border-border bg-card hidden w-96 items-center gap-2 rounded-lg border px-3 py-2 shadow-none md:flex">
          <Search className="text-muted-foreground h-4 w-4 shrink-0" />
          <Input
            type="text"
            placeholder="Search"
            className="placeholder:text-muted-foreground h-auto border-none bg-transparent p-0 text-sm shadow-none focus-visible:ring-0"
          />
          <Badge
            variant="outline"
            className="border-border text-muted-foreground shrink-0 rounded-md px-1.5 py-0.5 text-xs"
          >
            ⌘ + F
          </Badge>
        </div>
      </div>

      {/* Right: icons + user */}
      <div className="flex items-center gap-2">
        {/* Search icon — mobile only, expands to full-width search on tap */}
        <button
          className="border-border text-muted-foreground hover:bg-accent hover:text-foreground rounded-lg border p-2 transition-colors md:hidden"
          onClick={() => setSearchOpen(true)}
        >
          <Search className="h-4 w-4" />
        </button>

        {/* Icon buttons — hide less-critical ones on xs */}
        <button className="border-border text-muted-foreground hover:bg-accent hover:text-foreground hidden rounded-lg border p-2 transition-colors sm:inline-flex">
          <Gift className="h-4 w-4" />
        </button>
        <button className="border-border text-muted-foreground hover:bg-accent hover:text-foreground rounded-lg border p-2 transition-colors">
          <Bell className="h-4 w-4" />
        </button>
        <button className="border-border text-muted-foreground hover:bg-accent hover:text-foreground hidden rounded-lg border p-2 transition-colors sm:inline-flex">
          <Info className="h-4 w-4" />
        </button>

        <ToggleTheme />

        <div className="bg-border mx-1 h-6 w-px" />

        {/* User profile */}
        <Link
          href="/"
          className="hover:bg-accent flex cursor-pointer items-center gap-2.5 rounded-lg px-2 py-1.5 transition-colors"
        >
          <Image
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ4YreOWfDX3kK-QLAbAL4ufCPc84ol2MA8Xg&s"
            width={32}
            height={32}
            alt="avatar"
            className="border-border rounded-full border object-cover"
          />
          {/* Name + role — hidden on xs, shown on sm+ */}
          <div className="hidden flex-col leading-tight sm:flex">
            <span className="text-foreground text-sm font-semibold">
              {user?.name || "User"}
            </span>
            <span className="text-muted-foreground text-xs capitalize">
              {user?.role?.toLowerCase() || "member"}
            </span>
          </div>
        </Link>
      </div>
    </nav>
  );
}
