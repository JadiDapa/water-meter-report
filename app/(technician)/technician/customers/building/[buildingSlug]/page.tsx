import PageHeader from "@/components/root/PageHeader";
import { CustomerService } from "@/servers/services/customer.service";
import DynamicBreadcrumb from "@/components/root/DynamicBreadcrumb";
import CustomerTable from "@/components/root/user/customer/CustomerTable";

export default async function TechnicianCustomersByBuildingPage({
  params,
}: {
  params: Promise<{ buildingSlug: string }>;
}) {
  const { buildingSlug } = await params;
  const customers = await CustomerService.getByBuildingSlug(buildingSlug);

  return (
    <main className="min-h-screen w-full space-y-8 md:rounded-2xl">
      <div className="flex flex-col items-center justify-between lg:flex-row">
        <div className="space-y-2">
          <DynamicBreadcrumb />
          <PageHeader
            title={`Tipe Bangunan: ${buildingSlug.toUpperCase()}`}
            subtitle={`Semua pelanggan di ${buildingSlug.toUpperCase()}`}
          />
        </div>
      </div>

      <div className="space-y-2">
        <h1 className="text-foreground text-xl font-medium tracking-tight">
          Daftar Pelanggan
        </h1>
        <CustomerTable customers={customers} basePath="/technician/customers" />
      </div>
    </main>
  );
}
