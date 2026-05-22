import { ReactNode } from "react";
import { redirect } from "next/navigation";
import { SidebarProvider } from "@/components/ui/sidebar";
import DashboardSidebar from "@/components/root/DashboardSidebar";
import DashboardNavbar from "@/components/root/DashboardNavbar";
import { getCurrentUser } from "@/app/actions/user.actions";
export default async function TechnicianLayout({ children }: { children: ReactNode }) {
  const user = await getCurrentUser();

  if (user.role !== "TECHNICIAN") redirect("/");

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <DashboardSidebar user={user} role="TECHNICIAN" />
        <main className="bg-background flex flex-1 flex-col">
          <DashboardNavbar user={user} />
          <div className="flex-1 overflow-auto p-6">{children}</div>
        </main>
      </div>
    </SidebarProvider>
  );
}
