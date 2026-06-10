import PageHeader from "@/components/root/PageHeader";
import DynamicBreadcrumb from "@/components/root/DynamicBreadcrumb";
import { TechnicianService } from "@/servers/services/technician.service";
import TechnicianTable from "@/components/root/user/technician/TechnicianTable";
import TechnicianStats from "@/components/root/user/technician/TechnicianStats";
import CreateTechnicianDialog from "@/components/root/user/technician/CreateTechnicianDialog";

export default async function AdminTechniciansPage() {
  const technicians = await TechnicianService.getAll();

  return (
    <main className="min-h-screen w-full space-y-6 md:rounded-2xl">
      <div className="flex flex-col items-start gap-4 justify-between lg:flex-row lg:items-center">
        <div className="space-y-2">
          <DynamicBreadcrumb />
          <PageHeader title="Daftar Teknisi" subtitle="Kelola semua teknisi" />
        </div>
        <div className="w-full sm:w-auto">
          <CreateTechnicianDialog />
        </div>
      </div>

      <TechnicianStats />

      <div className="space-y-2">
        <h2 className="text-foreground text-xl font-medium tracking-tight">
          Daftar Teknisi
        </h2>
        <TechnicianTable technicians={technicians} basePath="/admin/users/technicians" showActions />
      </div>
    </main>
  );
}
