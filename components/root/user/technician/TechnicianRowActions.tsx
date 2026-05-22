"use client";

import EditTechnicianDialog from "./EditTechnicianDialog";
import DeleteConfirmDialog from "../../DeleteConfirmDialog";
import { deleteTechnician } from "@/app/actions/technician.action";
import { TechnicianType } from "@/servers/validators/technician.validator";

export default function TechnicianRowActions({ technician }: { technician: TechnicianType }) {
  return (
    <div className="flex items-center gap-1">
      <EditTechnicianDialog technician={technician} />
      <DeleteConfirmDialog
        onDelete={() => deleteTechnician(technician.id)}
        label="teknisi ini"
      />
    </div>
  );
}
