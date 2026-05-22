"use client";

import EditComplaintDialog from "./EditComplaintDialog";
import DeleteConfirmDialog from "../DeleteConfirmDialog";
import { deleteComplaint } from "@/app/actions/complaint.actions";
import { ComplaintType } from "@/servers/validators/complaint.validator";

export default function ComplaintRowActions({ complaint }: { complaint: ComplaintType }) {
  return (
    <div className="flex items-center gap-1">
      <EditComplaintDialog complaint={complaint} />
      <DeleteConfirmDialog
        onDelete={() => deleteComplaint(complaint.id)}
        label="keluhan ini"
      />
    </div>
  );
}
