"use client";

import { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";
import { ReportType } from "@/servers/validators/report.validator";
import DataTable from "../DataTable";
import SearchDataTable from "../SearchDataTable";
import TableSorter from "../TableSorter";
import ReportRowActions from "./ReportRowActions";

interface ReportTableProps {
  reports: ReportType[];
  basePath?: string;
  showActions?: boolean;
}

export default function ReportTable({
  reports,
  basePath = "/admin/reports",
  showActions = false,
}: ReportTableProps) {
  const columns = createReportColumns(basePath, showActions);
  return (
    <DataTable
      columns={columns}
      data={reports}
      filters={(table) => (
        <div className="grid w-full items-end gap-4 p-4 lg:grid-cols-3 lg:gap-6">
          <SearchDataTable
            table={table}
            column="customer"
            placeholder="Search Customer..."
          />
          <SearchDataTable
            table={table}
            column="technician"
            placeholder="Search Technician..."
          />
          <SearchDataTable
            table={table}
            column="location"
            placeholder="Search Location..."
          />
        </div>
      )}
    />
  );
}

export const createReportColumns = (
  basePath: string,
  showActions = false,
): ColumnDef<ReportType>[] => [
  {
    id: "index",
    header: ({ column }) => <TableSorter isFirst column={column} header="#" />,
    cell: ({ row }) => (
      <div className="text-muted-foreground max-w-fit ps-5 text-center text-xs">
        {row.index + 1}
      </div>
    ),
  },
  {
    accessorKey: "customer",
    accessorFn: (row) =>
      `${row.customer?.fullname} ${row.customer?.user.username}`,
    header: ({ column }) => <TableSorter column={column} header="CUSTOMER" />,
    cell: ({ row }) => {
      const name = row.original.customer?.fullname;
      const username = row.original.customer?.user?.username;
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
            <span className="text-muted-foreground text-xs">{username}</span>
          </div>
        </div>
      );
    },
  },
  {
    id: "technician",
    accessorFn: (row) =>
      `${row.technician?.fullname} ${row.technician?.user.username}`,
    header: ({ column }) => <TableSorter column={column} header="TECHNICIAN" />,
    cell: ({ row }) => {
      const name = row.original.technician?.fullname;
      const username = row.original.technician?.user?.username;
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
            <span className="text-muted-foreground text-xs">{username}</span>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "buildingSlug",
    header: ({ column }) => <TableSorter column={column} header="BUILDING" />,
    cell: ({ row }) => (
      <span className="bg-muted rounded-md px-2 py-1 text-xs font-medium uppercase">
        {row.original.customer.buildingSlug}
      </span>
    ),
  },
  {
    accessorKey: "location",
    header: ({ column }) => <TableSorter column={column} header="LOCATION" />,
    cell: ({ row }) => (
      <span className="bg-muted rounded-md px-2 py-1 text-xs font-medium uppercase">
        {row.original.location}
      </span>
    ),
  },
  {
    id: "values",
    header: () => <span className="text-xs">VALUES</span>,
    cell: ({ row }) => {
      const raw = row.original.values;
      let display = `${raw} m³`;
      try {
        const parsed = JSON.parse(raw);
        if (typeof parsed === "object" && parsed.current !== undefined) {
          display = `${parsed.current} m³`;
        } else if (typeof parsed === "number") {
          display = `${parsed} m³`;
        }
      } catch {
        // raw is plain number string
      }

      return (
        <span className="rounded-md bg-blue-100 px-2 py-1 text-xs font-medium text-blue-600">
          {display}
        </span>
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
          <span>{date.toLocaleDateString()}</span>
          <span className="text-muted-foreground text-xs">
            {date.toLocaleTimeString()}
          </span>
        </div>
      );
    },
  },
  ...(showActions
    ? [
        {
          id: "actions",
          header: () => <span className="text-xs">ACTIONS</span>,
          cell: ({ row }: { row: { original: ReportType } }) => (
            <ReportRowActions report={row.original} />
          ),
        } as ColumnDef<ReportType>,
      ]
    : []),
];
