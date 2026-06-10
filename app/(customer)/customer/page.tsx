import { getCurrentUser } from "@/app/actions/user.actions";
import { CustomerService } from "@/servers/services/customer.service";
import { ReportService } from "@/servers/services/report.service";
import { ComplaintService } from "@/servers/services/complaint.service";
import WaterUsageChart from "@/components/root/user/customer/WaterUsageChart";
import UsageStats from "@/components/root/user/customer/UsageStats";
import ReportCard from "@/components/root/user/customer/reports/ReportCard";
import ComplaintCard from "@/components/root/user/customer/complaints/ComplaintCard";
import PendingComplaintBanner from "@/components/root/user/customer/complaints/PendingComplaintBanner";
import PageHeader from "@/components/root/PageHeader";
import Link from "next/link";
import { ComplaintStatus } from "@/generated/prisma";

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

  const rawReports = await ReportService.getByCustomerId(customerProfile.id);
  const reports = [...rawReports].sort(
    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
  );

  const rawComplaints = await ComplaintService.getByCustomerId(
    customerProfile.id,
  );

  const complaints = [...rawComplaints].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );
  const featuredComplaint = complaints.find(
    (c) => c.status === ComplaintStatus.PENDING,
  );
  const otherComplaints = featuredComplaint
    ? complaints.filter((c) => c.id !== featuredComplaint.id)
    : complaints;

  return (
    <div className="space-y-8">
      <PageHeader
        title={`Halo, ${user.name}!`}
        subtitle={`ID Pelanggan: ${customerProfile.customerId} · ${customerProfile.buildingSlug}`}
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
            {reports.map((report, i) => (
              <Link key={report.id} href={`/customer/reports/${report.id}`}>
                <ReportCard
                  report={report}
                  previousValue={i > 0 ? Number(reports[i - 1].values) : undefined}
                />
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
          <div className="space-y-4">
            {featuredComplaint && (
              <PendingComplaintBanner complaint={featuredComplaint} />
            )}
            {otherComplaints.length > 0 && (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
                {otherComplaints.map((complaint) => (
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
        )}
      </div>
    </div>
  );
}
