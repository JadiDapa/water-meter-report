import PageHeader from "@/components/root/PageHeader";
import DynamicBreadcrumb from "@/components/root/DynamicBreadcrumb";
import { getCurrentUser } from "@/app/actions/user.actions";
import { CustomerService } from "@/servers/services/customer.service";
import CreateReportForm from "@/components/root/reports/CreateReportForm";
import { TechnicianService } from "@/servers/services/technician.service";

export default async function TechnicianCreateReportPage() {
  const user = await getCurrentUser();
  const customers = await CustomerService.getAll();
  const technician = await TechnicianService.getByUserId(user.id);

  return (
    <main className="min-h-screen w-full space-y-6 md:rounded-2xl">
      <div className="flex flex-col items-start gap-4 justify-between lg:flex-row lg:items-center">
        <div className="space-y-2">
          <DynamicBreadcrumb />
          <PageHeader title="Buat Laporan" subtitle="Tambah laporan meteran air baru" />
        </div>
      </div>

      <CreateReportForm customers={customers} technicianId={technician?.id} />
    </main>
  );
}
