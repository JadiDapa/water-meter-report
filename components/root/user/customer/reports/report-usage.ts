import { ReportType } from "@/servers/validators/report.validator";

export interface ReportWithUsage {
  report: ReportType;
  /** Bacaan meteran bulan sebelumnya (untuk menghitung selisih). */
  previousValue?: number;
  /** Pemakaian (selisih) bulan sebelumnya (untuk menghitung persentase). */
  previousUsage?: number;
}

/**
 * Urutkan laporan dari bulan terbaru, sambil menghitung selisih pemakaian
 * dan pemakaian bulan sebelumnya untuk tiap laporan.
 */
export function buildReportUsageHistory(
  reports: ReportType[],
): ReportWithUsage[] {
  const ascending = [...reports].sort(
    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
  );

  return ascending
    .map((report, i) => {
      const previousValue =
        i > 0 ? Number(ascending[i - 1].values) : undefined;
      const previousUsage =
        i > 1
          ? Number(ascending[i - 1].values) - Number(ascending[i - 2].values)
          : undefined;
      return { report, previousValue, previousUsage };
    })
    .reverse();
}
