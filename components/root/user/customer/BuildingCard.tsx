"use client";

import { BuildingType } from "@/servers/validators/building.validator";
import Link from "next/link";
import { Building2, Users } from "lucide-react";
import EditBuildingDialog from "./EditBuildingDialog";
import DeleteConfirmDialog from "../../DeleteConfirmDialog";
import { deleteBuilding } from "@/app/actions/building.actions";

type Props = {
  building: BuildingType;
  basePath?: string;
  showActions?: boolean;
};

export function BuildingCard({
  building,
  basePath = "/admin/users/customers",
  showActions = false,
}: Props) {
  return (
    <div className="group hover:shadow-primary/5 bg-card relative space-y-2 overflow-hidden rounded-md border p-5 transition-all duration-300 hover:shadow-lg">
      {showActions && (
        <div className="absolute top-2 right-2 flex items-center gap-0.5 opacity-0 transition-opacity group-hover:opacity-100">
          <EditBuildingDialog building={building} />
          <DeleteConfirmDialog
            onDelete={() => deleteBuilding(building.id)}
            label="gedung ini"
          />
        </div>
      )}
      <Link href={`${basePath}/building/${building.slug}`} className="block">
        <div className="bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground flex h-11 w-11 shrink-0 items-center justify-center rounded-lg transition-colors duration-300">
          <Building2 className="h-5 w-5" />
        </div>
        <div className="mt-2 min-w-0 flex-1">
          <h3 className="text-foreground group-hover:text-primary truncate text-sm font-semibold transition-colors">
            {building.name}
          </h3>
          <p className="text-muted-foreground mt-0.5 flex items-center gap-1.5 text-xs">
            <Users className="h-3.5 w-3.5" />
            {building.customers.length} Customers
          </p>
        </div>
      </Link>
    </div>
  );
}
