"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { usePathname } from "next/navigation";
import { useClerk } from "@clerk/nextjs";
import Link from "next/link";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useRouter } from "next/navigation";
import { User } from "@/generated/prisma";
import { MenuItem, adminMenuItems, technicianMenuItems } from "@/lib/sidebar-menu";
import {
  PanelRightOpen,
  LogOut,
  ChevronsUpDown,
  Droplet,
  ChevronRight,
} from "lucide-react";
import { Separator } from "../ui/separator";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../ui/collapsible";

type Props = {
  user: User;
  role: "ADMIN" | "TECHNICIAN";
  pendingComplaintCount?: number;
};

export default function DashboardSidebar({ user, role, pendingComplaintCount }: Props) {
  const menuItems: MenuItem[] =
    role === "ADMIN" ? adminMenuItems : technicianMenuItems;
  const pathname = usePathname();
  const { toggleSidebar } = useSidebar();
  const { signOut } = useClerk();
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut();
    router.replace("/sign-in");
  };

  return (
    <Sidebar className="border-none p-0">
      <SidebarContent className="bg-card">
        <div className="border-border bg-card flex h-screen flex-col border-r">
          {/* Header */}
          <div className="flex h-18.25 items-center justify-between border-b px-4 py-4">
            <div className="flex items-center gap-2">
              <Droplet className="text-primary size-8" />
              <div className="">
                <p className="text-foreground text-xl font-bold tracking-tight">
                  Tirta Musi
                </p>
                <p className="text-muted-foreground text-xs">
                  Manajemen Meteran Air
                </p>
              </div>
            </div>
            <button
              onClick={toggleSidebar}
              className="text-muted-foreground hover:bg-accent hover:text-foreground rounded-md p-1 transition-colors"
            >
              <PanelRightOpen className="size-5" strokeWidth={1.5} />
            </button>
          </div>

          {/* Scrollable nav area */}
          <ScrollArea className="flex-1 overflow-hidden px-3 py-4">
            {/* MENU section */}
            <SidebarGroup className="p-0 pb-4">
              <SidebarGroupLabel className="text-muted-foreground mb-1 text-[11px] font-semibold tracking-widest uppercase">
                Menu
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu className="gap-1.5">
                  {menuItems.map((item) => {
                    const active = pathname === item.url;

                    if (item.submenu) {
                      return (
                        <Collapsible
                          key={item.title}
                          className="group/collapsible"
                        >
                          <SidebarMenuItem className="px-1">
                            <CollapsibleTrigger asChild className="">
                              <SidebarMenuButton className="hover:bg-muted! data-[active=true]:bg-primary! flex h-10 cursor-pointer items-center gap-3 bg-transparent! text-sm data-[active=true]:text-white">
                                <item.icon className="size-5" />
                                <span className="text-sm">{item.title}</span>
                                <ChevronRight className="ml-auto size-4 transition-transform group-data-[state=open]/collapsible:rotate-90" />
                              </SidebarMenuButton>
                            </CollapsibleTrigger>

                            <CollapsibleContent>
                              <SidebarMenuSub>
                                {item.submenu.map((sub) => {
                                  const subActive = pathname === sub.url;
                                  return (
                                    <SidebarMenuSubItem
                                      key={sub.title}
                                      className="p-0"
                                    >
                                      <Link
                                        href={sub.url}
                                        className={`flex h-10 items-center gap-3 rounded-lg px-3 pl-8 font-medium transition-colors ${
                                          subActive
                                            ? "text-primary"
                                            : "text-muted-foreground hover:bg-accent hover:text-foreground"
                                        } text-sm`}
                                      >
                                        <span>{sub.title}</span>
                                      </Link>
                                    </SidebarMenuSubItem>
                                  );
                                })}
                              </SidebarMenuSub>
                            </CollapsibleContent>
                          </SidebarMenuItem>
                        </Collapsible>
                      );
                    }

                    return (
                      <SidebarMenuItem key={item.title}>
                        <SidebarMenuButton
                          isActive={active}
                          className="hover:bg-muted! data-[active=true]:bg-primary! bg-transparent! text-sm data-[active=true]:text-white"
                          asChild
                        >
                          <Link
                            href={item.url || "#"}
                            className={`flex h-10 items-center gap-3 rounded-lg px-3 font-medium transition-colors ${
                              active
                                ? "text-background"
                                : "text-muted-foreground hover:bg-accent hover:text-foreground"
                            }`}
                          >
                            <item.icon className="size-5 shrink-0" />
                            <span className="flex-1">{item.title}</span>
                            {(item.url === "/admin/complaints" ||
                              item.url === "/technician/my-complaints") &&
                              pendingComplaintCount != null &&
                              pendingComplaintCount > 0 && (
                                <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1.5 text-[10px] font-bold text-white">
                                  {pendingComplaintCount > 99 ? "99+" : pendingComplaintCount}
                                </span>
                              )}
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    );
                  })}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            <Separator />

            {/* GENERAL section */}
            <SidebarGroup className="p-0 pb-4">
              <SidebarGroupLabel className="text-muted-foreground mb-1 text-[11px] font-semibold tracking-widest uppercase">
                General
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu className="gap-0.5">
                  <SidebarMenuItem className="p-0">
                    <SidebarMenuButton
                      asChild
                      className="hover:bg-muted! data-[active=true]:bg-primary! bg-transparent! text-sm"
                    >
                      <button
                        onClick={handleSignOut}
                        className="text-muted-foreground hover:bg-accent hover:text-foreground flex h-9 w-full items-center gap-3 rounded-lg px-3 font-medium transition-colors"
                      >
                        <LogOut className="size-5 shrink-0" />
                        <span>Log Out</span>
                      </button>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </ScrollArea>

          {/* Bottom: User profile */}
          <div className="border-border border-t px-3 py-3">
            <button className="hover:bg-accent flex w-full items-center gap-3 rounded-lg py-2 transition-colors">
              <div className="bg-primary text-primary-foreground flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-semibold">
                {(user?.name || "U").charAt(0).toUpperCase()}
              </div>
              <div className="flex min-w-0 flex-1 flex-col items-start leading-tight">
                <span className="text-foreground truncate text-sm font-semibold">
                  {user?.name || "User"}
                </span>
                <span className="text-muted-foreground truncate text-xs capitalize">
                  {user?.role?.toLowerCase() || "member"}
                </span>
              </div>
              <ChevronsUpDown className="text-muted-foreground size-5 shrink-0" />
            </button>
          </div>
        </div>
      </SidebarContent>
    </Sidebar>
  );
}
