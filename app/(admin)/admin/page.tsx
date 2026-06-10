import PageHeader from "@/components/root/PageHeader";
import { getCurrentUser } from "@/app/actions/user.actions";
import { ReportService } from "@/servers/services/report.service";
import { ComplaintService } from "@/servers/services/complaint.service";
import { CustomerService } from "@/servers/services/customer.service";
import { TechnicianService } from "@/servers/services/technician.service";
import { Card, CardContent } from "@/components/ui/card";
import {
  ScrollText,
  MessagesSquare,
  Users,
  Wrench,
  TrendingUp,
  TrendingDown,
} from "lucide-react";
import AdminDashboardCharts from "@/components/root/AdminDashboardCharts";

function getMonthlyData(
  reports: { createdAt: Date }[],
  complaints: { createdAt: Date }[],
) {
  const now = new Date();
  const months = Array.from({ length: 6 }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - (5 - i), 1);
    return {
      month: d.toLocaleString("default", { month: "short" }),
      year: d.getFullYear(),
      monthIndex: d.getMonth(),
    };
  });

  return months.map(({ month, year, monthIndex }) => ({
    month,
    reports: reports.filter((r) => {
      const d = new Date(r.createdAt);
      return d.getMonth() === monthIndex && d.getFullYear() === year;
    }).length,
    complaints: complaints.filter((r) => {
      const d = new Date(r.createdAt);
      return d.getMonth() === monthIndex && d.getFullYear() === year;
    }).length,
  }));
}

export default async function AdminDashboardPage() {
  const [user, reports, complaints, customers, technicians] = await Promise.all(
    [
      getCurrentUser(),
      ReportService.getAll(),
      ComplaintService.getAll(),
      CustomerService.getAll(),
      TechnicianService.getAll(),
    ],
  );

  const now = new Date();
  const thisMonth = reports.filter((r) => {
    const d = new Date(r.createdAt);
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  }).length;
  const lastMonth = reports.filter((r) => {
    const d = new Date(r.createdAt);
    return d.getMonth() === now.getMonth() - 1 && d.getFullYear() === now.getFullYear();
  }).length;

  const thisMonthComplaints = complaints.filter((r) => {
    const d = new Date(r.createdAt);
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  }).length;

  const reportTrend = lastMonth > 0 ? Math.round(((thisMonth - lastMonth) / lastMonth) * 100) : 0;

  const statsCards = [
    {
      title: "Total Laporan",
      value: reports.length,
      sub: `${thisMonth} bulan ini`,
      trend: reportTrend,
      icon: ScrollText,
      color: "bg-blue-500/10 text-blue-600",
    },
    {
      title: "Total Keluhan",
      value: complaints.length,
      sub: `${thisMonthComplaints} bulan ini`,
      trend: null,
      icon: MessagesSquare,
      color: "bg-red-500/10 text-red-600",
    },
    {
      title: "Total Pelanggan",
      value: customers.length,
      sub: "terdaftar",
      trend: null,
      icon: Users,
      color: "bg-emerald-500/10 text-emerald-600",
    },
    {
      title: "Total Teknisi",
      value: technicians.length,
      sub: "aktif",
      trend: null,
      icon: Wrench,
      color: "bg-orange-500/10 text-orange-600",
    },
  ];

  const chartData = getMonthlyData(reports, complaints);

  return (
    <main className="min-h-screen w-full space-y-8">
      <div className="flex flex-col items-start gap-4 justify-between lg:flex-row lg:items-center">
        <PageHeader
          title={`Selamat Datang, ${user.name}!`}
          subtitle="Pantau semua laporan, keluhan, dan pengguna dari sini."
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {statsCards.map((stat) => (
          <Card key={stat.title}>
            <CardContent className="flex items-center gap-4 p-6">
              <div
                className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${stat.color}`}
              >
                <stat.icon className="h-6 w-6" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-muted-foreground truncate text-xs">
                  {stat.title}
                </p>
                <p className="text-2xl font-bold">{stat.value}</p>
                <div className="flex items-center gap-1">
                  <span className="text-muted-foreground text-xs">
                    {stat.sub}
                  </span>
                  {stat.trend !== null && (
                    <span
                      className={`flex items-center gap-0.5 text-xs font-medium ${
                        stat.trend >= 0
                          ? "text-emerald-600"
                          : "text-red-500"
                      }`}
                    >
                      {stat.trend >= 0 ? (
                        <TrendingUp className="h-3 w-3" />
                      ) : (
                        <TrendingDown className="h-3 w-3" />
                      )}
                      {Math.abs(stat.trend)}%
                    </span>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <AdminDashboardCharts data={chartData} />
    </main>
  );
}
