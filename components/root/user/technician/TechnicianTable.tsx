"use client";

import { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";
import { Eye } from "lucide-react";
import DataTable from "../../DataTable";
import SearchDataTable from "../../SearchDataTable";
import { TechnicianType } from "@/servers/validators/technician.validator";
import TableSorter from "../../TableSorter";
import TechnicianRowActions from "./TechnicianRowActions";

interface TechnicianTableProps {
  technicians: TechnicianType[];
  basePath?: string;
  showActions?: boolean;
}

export default function TechnicianTable({
  technicians,
  basePath = "/admin/users/technicians",
  showActions = false,
}: TechnicianTableProps) {
  const columns = createTechnicianColumns(basePath, showActions);
  return (
    <DataTable
      columns={columns}
      data={technicians}
      filters={(table) => (
        <div className="grid w-full items-end gap-4 p-4 lg:grid-cols-3 lg:gap-6">
          <SearchDataTable
            table={table}
            column="technician"
            placeholder="Search Technician Name..."
          />
          <SearchDataTable
            table={table}
            column="region"
            placeholder="Search Region..."
          />
          <SearchDataTable
            table={table}
            column="phoneNumber"
            placeholder="Search Phone Number..."
          />
        </div>
      )}
    />
  );
}

export const createTechnicianColumns = (
  basePath: string,
  showActions = false,
): ColumnDef<TechnicianType>[] => [
  {
    id: "index",
    header: ({ column }) => <TableSorter isFirst column={column} header="#" />,
    cell: ({ row }) => (
      <div className="text-muted-foreground max-w-fit py-2 ps-5 text-center text-xs">
        {row.index + 1}
      </div>
    ),
  },

  {
    id: "technician",
    header: ({ column }) => <TableSorter column={column} header="TECHNICIAN" />,
    cell: ({ row }) => {
      const name = row.original.fullname;
      const firstName = name.split(" ")[0];

      return (
        <div className="flex items-center gap-3">
          <div className="bg-primary/10 text-primary flex h-9 w-9 items-center justify-center rounded-full text-sm font-semibold">
            {firstName.charAt(0)}
          </div>
          <div className="flex flex-col leading-tight">
            <Link
              href={`${basePath}/${row.original.id}`}
              className="font-medium hover:underline"
            >
              {name}
            </Link>
            <span className="text-muted-foreground text-xs">
              {row.original.phoneNumber}
            </span>
          </div>
        </div>
      );
    },
  },

  {
    accessorKey: "region",
    header: ({ column }) => <TableSorter column={column} header="REGION" />,
    cell: ({ row }) => (
      <span className="text-muted-foreground font-mono text-xs">
        {row.original.region}
      </span>
    ),
  },

  {
    id: "reports",
    header: () => <span className="text-xs">REPORTS</span>,
    cell: ({ row }) => {
      const reports = row.original.reports.length ?? 0;
      const hasReported = row.original.reports.length > 0;

      return (
        <div className="flex items-center gap-2">
          <span className="rounded-md bg-blue-100 px-2 py-1 text-xs font-medium text-blue-600">
            {reports}
          </span>
          <span
            className={`h-2 w-2 rounded-full ${
              hasReported ? "bg-green-500" : "bg-muted-foreground/40"
            }`}
          />
        </div>
      );
    },
  },

  {
    accessorKey: "createdAt",
    header: ({ column }) => <TableSorter column={column} header="CREATED" />,
    cell: ({ row }) => {
      const date = new Date(row.original.createdAt);
      return (
        <div className="flex flex-col text-sm leading-tight">
          <span>
            {date.toLocaleString("id-ID", { month: "long", year: "numeric" })}
          </span>
          <span className="text-muted-foreground text-xs">
            {date.toLocaleString("id-ID", { day: "2-digit", month: "short" })}
          </span>
        </div>
      );
    },
  },

  {
    id: "actions",
    header: () => <span className="text-xs">ACTIONS</span>,
    cell: ({ row }: { row: { original: TechnicianType } }) => (
      <div className="flex items-center gap-1">
        <Link
          href={`${basePath}/${row.original.id}`}
          className="text-muted-foreground hover:text-foreground inline-flex h-8 w-8 items-center justify-center rounded-md transition-colors"
        >
          <Eye className="h-4 w-4" />
        </Link>
        {showActions && <TechnicianRowActions technician={row.original} />}
      </div>
    ),
  } as ColumnDef<TechnicianType>,
];
