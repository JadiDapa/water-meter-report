import { getCurrentUser } from "@/app/actions/user.actions";
import { CustomerService } from "@/servers/services/customer.service";
import { ReportService } from "@/servers/services/report.service";
import { ComplaintService } from "@/servers/services/complaint.service";
import WaterUsageChart from "@/components/root/user/customer/WaterUsageChart";
import UsageStats from "@/components/root/user/customer/UsageStats";
import ReportCard from "@/components/root/user/customer/reports/ReportCard";
import ComplaintCard from "@/components/root/user/customer/complaints/ComplaintCard";
import PageHeader from "@/components/root/PageHeader";
import Link from "next/link";

export default async function CustomerHomePage() {
  const user = await getCurrentUser();

  const { items } = await CustomerService.list({
    userId: user.id,
    pageSize: 1,
  });
  const customerProfile = items[0];

  if (!customerProfile) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 text-center">
        <PageHeader
          title="Profil belum lengkap"
          subtitle="Hubungi administrator untuk melengkapi data pelanggan Anda."
        />
      </div>
    );
  }

  const reports = await ReportService.getByCustomerId(customerProfile.id);
  const complaints = await ComplaintService.getByCustomerId(customerProfile.id);

  return (
    <div className="space-y-8">
      <PageHeader
        title={`Halo, ${user.name}!`}
        subtitle={`ID Pelanggan: ${customerProfile.customerId} · ${customerProfile.building?.name ?? customerProfile.buildingSlug}`}
      />

      <div className="flex flex-col gap-6 lg:flex-row">
        <WaterUsageChart reports={reports} />
        <UsageStats reports={reports} />
      </div>

      <div>
        <h2 className="mb-4 text-lg font-semibold">Laporan Terbaru</h2>
        {reports.length === 0 ? (
          <p className="text-muted-foreground text-sm">Belum ada laporan.</p>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
            {reports.map((report) => (
              <Link key={report.id} href={`/customer/reports/${report.id}`}>
                <ReportCard report={report} />
              </Link>
            ))}
          </div>
        )}
      </div>

      <div>
        <h2 className="mb-4 text-lg font-semibold">Keluhan Terbaru</h2>
        {complaints.length === 0 ? (
          <p className="text-muted-foreground text-sm">Belum ada keluhan.</p>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
            {complaints.map((complaint) => (
              <Link
                key={complaint.id}
                href={`/customer/complaints/${complaint.id}`}
              >
                <ComplaintCard complaint={complaint} />
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
