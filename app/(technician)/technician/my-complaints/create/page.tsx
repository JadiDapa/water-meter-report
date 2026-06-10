import PageHeader from "@/components/root/PageHeader";
import DynamicBreadcrumb from "@/components/root/DynamicBreadcrumb";
import { getCurrentUser } from "@/app/actions/user.actions";
import { TechnicianService } from "@/servers/services/technician.service";
import { CustomerService } from "@/servers/services/customer.service";
import CreateComplaintForm from "@/components/root/complaints/CreateComplaintForm";

export default async function TechnicianCreateComplaintPage() {
  const user = await getCurrentUser();
  const customers = await CustomerService.getAll();
  const technician = await TechnicianService.getByUserId(user.id);

  return (
    <main className="min-h-screen w-full space-y-6 md:rounded-2xl">
      <div className="flex flex-col items-start gap-4 justify-between lg:flex-row lg:items-center">
        <div className="space-y-2">
          <DynamicBreadcrumb />
          <PageHeader title="Buat Keluhan" subtitle="Tambah keluhan pelanggan baru" />
        </div>
      </div>

      <CreateComplaintForm customers={customers} technicianId={technician?.id} />
    </main>
  );
}
