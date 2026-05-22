import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Bell, Search, Gift, Info } from "lucide-react";
import Image from "next/image";
import { User } from "@/generated/prisma";
import { ToggleTheme } from "./ToggleTheme";
import Link from "next/link";

export default async function DashboardNavbar({ user }: { user: User }) {
  return (
    <nav className="border-border bg-card sticky top-0 z-50 flex items-center justify-between border-b px-6 py-3">
      {/* Search */}
      <div className="border-border bg-card flex w-120 items-center gap-2 rounded-lg border px-3 py-2 shadow-none">
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

      {/* Right side: icons + user */}
      <div className="flex items-center gap-2">
        {/* Icon buttons */}
        <button className="border-border text-muted-foreground hover:bg-accent hover:text-foreground rounded-lg border p-2 transition-colors">
          <Gift className="h-4 w-4" />
        </button>
        <button className="border-border text-muted-foreground hover:bg-accent hover:text-foreground rounded-lg border p-2 transition-colors">
          <Bell className="h-4 w-4" />
        </button>
        <button className="border-border text-muted-foreground hover:bg-accent hover:text-foreground rounded-lg border p-2 transition-colors">
          <Info className="h-4 w-4" />
        </button>

        <ToggleTheme />

        {/* Divider */}
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
          <div className="flex flex-col leading-tight">
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
