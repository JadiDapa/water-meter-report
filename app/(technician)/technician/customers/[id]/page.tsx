import ComplaintCard from "@/components/root/user/customer/complaints/ComplaintCard";
import ReportCard from "@/components/root/user/customer/reports/ReportCard";
import { buildReportUsageHistory } from "@/components/root/user/customer/reports/report-usage";
import DynamicBreadcrumb from "@/components/root/DynamicBreadcrumb";
import CustomerHeaderCard from "@/components/root/user/customer/CustomerHeaderCard";
import { ComplaintService } from "@/servers/services/complaint.service";
import { CustomerService } from "@/servers/services/customer.service";
import { ReportService } from "@/servers/services/report.service";
import WaterUsageChart from "@/components/root/user/customer/WaterUsageChart";
import UsageStats from "@/components/root/user/customer/UsageStats";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { notFound } from "next/navigation";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function TechnicianCustomerDetailPage({ params }: PageProps) {
  const { id } = await params;
  const customer = await CustomerService.getById(Number(id));
  if (!customer) notFound();

  const reports = await ReportService.getByCustomerId(Number(id));
  const complaints = await ComplaintService.getByCustomerId(Number(id));

  return (
    <main className="min-h-screen w-full space-y-8 md:rounded-2xl">
      <div className="space-y-4">
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <DynamicBreadcrumb />
          <Link href="/technician/my-reports/create" className="w-full sm:w-auto">
            <Button className="flex w-full cursor-pointer items-center justify-center gap-2 px-6 sm:w-auto">
              <p className="text-lg font-semibold">Tambah Laporan</p>
              <Plus className="size-5" />
            </Button>
          </Link>
        </div>
        <CustomerHeaderCard customer={customer} />
      </div>

      <div className="flex flex-col gap-6 lg:flex-row">
        <WaterUsageChart reports={reports} />
        <UsageStats reports={reports} />
      </div>

      <div>
        <h2 className="mb-4 text-lg font-semibold">Laporan Terbaru</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {buildReportUsageHistory(reports).map(
            ({ report, previousValue, previousUsage }) => (
              <Link
                key={report.id}
                href={`/technician/my-reports/${report.id}`}
              >
                <ReportCard
                  report={report}
                  previousValue={previousValue}
                  previousUsage={previousUsage}
                />
              </Link>
            ),
          )}
        </div>
      </div>

      <div>
        <h2 className="mb-4 text-lg font-semibold">Keluhan Terbaru</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
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
