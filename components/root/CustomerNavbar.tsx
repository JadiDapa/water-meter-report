"use client";

import { User } from "@/generated/prisma";
import { ToggleTheme } from "./ToggleTheme";
import { useClerk } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { Droplet, LogOut } from "lucide-react";

export default function CustomerNavbar({ user }: { user: User }) {
  const { signOut } = useClerk();
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut();
    router.replace("/sign-in");
  };

  return (
    <nav className="border-border bg-card sticky top-0 z-50 border-b px-6 py-3">
      <div className="mx-auto flex max-w-5xl items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-2">
          <Droplet className="text-primary size-6" />
          <span className="text-foreground text-lg font-bold tracking-tight">
            Tirta Musi
          </span>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-3">
          <ToggleTheme />

          <div className="bg-border mx-1 h-5 w-px" />

          <div className="flex items-center gap-2.5">
            <div className="bg-primary text-primary-foreground flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-semibold">
              {(user?.name || "U").charAt(0).toUpperCase()}
            </div>
            <div className="flex flex-col leading-tight">
              <span className="text-foreground text-sm font-semibold">
                {user?.name}
              </span>
              <span className="text-muted-foreground text-xs">Pelanggan</span>
            </div>
          </div>

          <button
            onClick={handleSignOut}
            className="text-muted-foreground hover:bg-accent hover:text-foreground rounded-lg p-2 transition-colors"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </nav>
  );
}
