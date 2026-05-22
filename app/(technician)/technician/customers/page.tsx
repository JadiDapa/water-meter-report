import PageHeader from "@/components/root/PageHeader";
import { CustomerService } from "@/servers/services/customer.service";
import { BuildingService } from "@/servers/services/building.service";
import DynamicBreadcrumb from "@/components/root/DynamicBreadcrumb";
import CustomerStats from "@/components/root/user/customer/CustomerStats";
import { BuildingCard } from "@/components/root/user/customer/BuildingCard";
import CustomerTable from "@/components/root/user/customer/CustomerTable";

export default async function TechnicianCustomersPage() {
  const customers = await CustomerService.getAll();
  const buildings = await BuildingService.getAll();

  return (
    <main className="min-h-screen w-full space-y-6 md:rounded-2xl">
      <div className="flex flex-col items-center justify-between lg:flex-row">
        <div className="space-y-2">
          <DynamicBreadcrumb />
          <PageHeader title="Daftar Pelanggan" subtitle="Lihat semua pelanggan" />
        </div>
      </div>

      <CustomerStats />

      <div className="space-y-2">
        <h2 className="text-foreground text-xl font-medium tracking-tight">
          Kategori Bangunan
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-7">
          {buildings.map((building) => (
            <BuildingCard
              key={building.id}
              building={building}
              basePath="/technician/customers"
            />
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <h2 className="text-foreground text-xl font-medium tracking-tight">
          Daftar Pelanggan
        </h2>
        <CustomerTable customers={customers} basePath="/technician/customers" />
      </div>
    </main>
  );
}
