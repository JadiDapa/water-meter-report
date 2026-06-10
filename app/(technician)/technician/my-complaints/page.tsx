import PageHeader from "@/components/root/PageHeader";
import { ComplaintService } from "@/servers/services/complaint.service";
import DynamicBreadcrumb from "@/components/root/DynamicBreadcrumb";
import ComplaintStats from "@/components/root/complaints/ComplaintStats";
import ComplaintTable from "@/components/root/complaints/ComplaintTable";
import { getCurrentUser } from "@/app/actions/user.actions";
import { TechnicianService } from "@/servers/services/technician.service";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export default async function TechnicianMyComplaintsPage() {
  const user = await getCurrentUser();
  const technician = await TechnicianService.getByUserId(user.id);
  const complaints = technician ? await ComplaintService.getByTechnicianId(technician.id) : [];

  return (
    <main className="min-h-screen w-full space-y-6 md:rounded-2xl">
      <div className="flex flex-col items-start gap-4 justify-between lg:flex-row lg:items-center">
        <div className="space-y-2">
          <DynamicBreadcrumb />
          <PageHeader title="Keluhan Saya" subtitle="Semua keluhan yang Anda buat" />
        </div>
        <Link href="/technician/my-complaints/create" className="w-full sm:w-auto">
          <Button className="flex w-full cursor-pointer items-center justify-center gap-2 px-6 sm:w-auto">
            <p className="text-lg font-semibold">Tambah Keluhan</p>
            <Plus className="size-5" />
          </Button>
        </Link>
      </div>

      <ComplaintStats complaints={complaints} />

      <div className="space-y-2">
        <h2 className="text-foreground text-xl font-medium tracking-tight">
          Daftar Keluhan
        </h2>
        <ComplaintTable complaints={complaints} basePath="/technician/my-complaints" showActions />
      </div>
    </main>
  );
}
