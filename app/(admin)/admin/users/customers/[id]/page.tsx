import ComplaintCard from "@/components/root/user/customer/complaints/ComplaintCard";
import ReportCard from "@/components/root/user/customer/reports/ReportCard";
import DynamicBreadcrumb from "@/components/root/DynamicBreadcrumb";
import CustomerHeaderCard from "@/components/root/user/customer/CustomerHeaderCard";
import { ComplaintService } from "@/servers/services/complaint.service";
import { CustomerService } from "@/servers/services/customer.service";
import { ReportService } from "@/servers/services/report.service";
import WaterUsageChart from "@/components/root/user/customer/WaterUsageChart";
import UsageStats from "@/components/root/user/customer/UsageStats";
import Link from "next/link";
import { notFound } from "next/navigation";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function AdminCustomerDetailPage({ params }: PageProps) {
  const { id } = await params;
  const customer = await CustomerService.getById(Number(id));
  if (!customer) notFound();

  const reports = await ReportService.getByCustomerId(Number(id));
  const complaints = await ComplaintService.getByCustomerId(Number(id));

  return (
    <main className="min-h-screen w-full space-y-8 md:rounded-2xl">
      <div className="space-y-4">
        <DynamicBreadcrumb />
        <CustomerHeaderCard customer={customer} />
      </div>

      <div className="flex flex-col gap-6 lg:flex-row">
        <WaterUsageChart reports={reports} />
        <UsageStats reports={reports} />
      </div>

      <div>
        <h2 className="mb-4 text-lg font-semibold">Laporan Terbaru</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {reports.map((report) => (
            <Link key={report.id} href={`/admin/reports/${report.id}`}>
              <ReportCard report={report} />
            </Link>
          ))}
        </div>
      </div>

      <div>
        <h2 className="mb-4 text-lg font-semibold">Keluhan Terbaru</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {complaints.map((complaint) => (
            <Link key={complaint.id} href={`/admin/complaints/${complaint.id}`}>
              <ComplaintCard complaint={complaint} />
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
