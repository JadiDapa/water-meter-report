import ComplaintCard from "@/components/root/user/customer/complaints/ComplaintCard";
import ReportCard from "@/components/root/user/customer/reports/ReportCard";
import DynamicBreadcrumb from "@/components/root/DynamicBreadcrumb";
import PageHeader from "@/components/root/PageHeader";
import { ComplaintService } from "@/servers/services/complaint.service";
import { CustomerService } from "@/servers/services/customer.service";
import { ReportService } from "@/servers/services/report.service";
import WaterUsageChart from "@/components/root/user/customer/WaterUsageChart";
import UsageStats from "@/components/root/user/customer/UsageStats";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function TechnicianCustomerDetailPage({ params }: PageProps) {
  const { id } = await params;
  const customer = await CustomerService.getById(Number(id));
  const reports = await ReportService.getByCustomerId(Number(id));
  const complaints = await ComplaintService.getByCustomerId(Number(id));

  return (
    <main className="min-h-screen w-full space-y-8 md:rounded-2xl">
      <div className="flex flex-col items-center justify-between lg:flex-row">
        <div className="space-y-2">
          <DynamicBreadcrumb />
          <PageHeader
            title={`Pelanggan: ${customer?.fullname}`}
            subtitle="Riwayat laporan dan keluhan pelanggan"
          />
        </div>
        <Link href="/technician/my-reports/create">
          <Button className="flex cursor-pointer items-center gap-2 px-6">
            <p className="text-lg font-semibold">Tambah Laporan</p>
            <Plus className="size-5" />
          </Button>
        </Link>
      </div>

      <div className="flex gap-6">
        <WaterUsageChart reports={reports} />
        <UsageStats reports={reports} />
      </div>

      <div>
        <h2 className="mb-4 text-lg font-semibold">Laporan Terbaru</h2>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {reports.map((report) => (
            <Link key={report.id} href={`/technician/my-reports/${report.id}`}>
              <ReportCard report={report} />
            </Link>
          ))}
        </div>
      </div>

      <div>
        <h2 className="mb-4 text-lg font-semibold">Keluhan Terbaru</h2>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {complaints.map((complaint) => (
            <Link key={complaint.id} href={`/technician/my-complaints/${complaint.id}`}>
              <ComplaintCard complaint={complaint} />
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
