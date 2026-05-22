"use client";

import EditCustomerDialog from "./EditCustomerDialog";
import DeleteConfirmDialog from "../../DeleteConfirmDialog";
import { deleteCustomer } from "@/app/actions/customer.actions";
import { CustomerType } from "@/servers/validators/customer.validator";
import { BuildingType } from "@/servers/validators/building.validator";

interface Props {
  customer: CustomerType;
  buildings: BuildingType[];
}

export default function CustomerRowActions({ customer, buildings }: Props) {
  return (
    <div className="flex items-center gap-1">
      <EditCustomerDialog customer={customer} buildings={buildings} />
      <DeleteConfirmDialog
        onDelete={() => deleteCustomer(customer.id)}
        label="pelanggan ini"
      />
    </div>
  );
}
