"use client";

import * as XLSX from "xlsx";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ReportType } from "@/servers/validators/report.validator";
import { MONTHS_ID, parseValues } from "@/lib/format";

interface ExportReportButtonProps {
  reports: ReportType[];
  month: number;
  year: number;
}

/**
 * Exports the (already month-filtered) reports to an `.xlsx` file in the
 * browser. The data mirrors what the table shows, so the spreadsheet always
 * matches the selected month.
 */
export default function ExportReportButton({
  reports,
  month,
  year,
}: ExportReportButtonProps) {
  const monthName = MONTHS_ID[month - 1];

  const handleExport = () => {
    const rows = reports.map((report, index) => {
      const { current, previous } = parseValues(report.values);
      return {
        No: index + 1,
        Pelanggan: report.customer?.fullname ?? "-",
        Username: report.customer?.user?.username ?? "-",
        "ID Pelanggan": report.customer?.customerId ?? "-",
        Bangunan: report.customer?.buildingSlug ?? "-",
        Lokasi: report.location,
        Teknisi: report.technician?.fullname ?? "-",
        "Meteran Awal (m³)": previous,
        "Meteran Akhir (m³)": current,
        "Pemakaian (m³)": current - previous,
        Tanggal: new Date(report.createdAt).toLocaleDateString("id-ID", {
          day: "2-digit",
          month: "long",
          year: "numeric",
        }),
      };
    });

    const worksheet = XLSX.utils.json_to_sheet(rows);
    worksheet["!cols"] = [
      { wch: 4 }, // No
      { wch: 22 }, // Pelanggan
      { wch: 16 }, // Username
      { wch: 14 }, // ID Pelanggan
      { wch: 12 }, // Bangunan
      { wch: 22 }, // Lokasi
      { wch: 22 }, // Teknisi
      { wch: 16 }, // Meteran Awal
      { wch: 16 }, // Meteran Akhir
      { wch: 14 }, // Pemakaian
      { wch: 18 }, // Tanggal
    ];

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(
      workbook,
      worksheet,
      `${monthName} ${year}`.slice(0, 31),
    );
    XLSX.writeFile(workbook, `Laporan-${monthName}-${year}.xlsx`);
  };

  return (
    <Button
      variant="outline"
      onClick={handleExport}
      disabled={reports.length === 0}
      className="flex w-full cursor-pointer items-center justify-center gap-2 sm:w-auto"
    >
      <Download className="size-4" />
      <span>Ekspor Excel</span>
    </Button>
  );
}
