"use client";

import EditReportDialog from "./EditReportDialog";
import DeleteConfirmDialog from "../DeleteConfirmDialog";
import { deleteReport } from "@/app/actions/report.actions";
import { ReportType } from "@/servers/validators/report.validator";

export default function ReportRowActions({ report }: { report: ReportType }) {
  return (
    <div className="flex items-center gap-1">
      <EditReportDialog report={report} />
      <DeleteConfirmDialog
        onDelete={() => deleteReport(report.id)}
        label="laporan ini"
      />
    </div>
  );
}
