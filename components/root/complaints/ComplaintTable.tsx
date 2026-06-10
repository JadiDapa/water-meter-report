"use client";

import { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";
import { Eye } from "lucide-react";
import { ComplaintType } from "@/servers/validators/complaint.validator";
import DataTable from "../DataTable";
import SearchDataTable from "../SearchDataTable";
import TableSorter from "../TableSorter";
import ComplaintRowActions from "./ComplaintRowActions";

interface ComplaintTableProps {
  complaints: ComplaintType[];
  basePath?: string;
  showActions?: boolean;
}

export default function ComplaintTable({
  complaints,
  basePath = "/admin/complaints",
  showActions = false,
}: ComplaintTableProps) {
  const columns = createComplaintColumns(basePath, showActions);
  return (
    <DataTable
      columns={columns}
      data={complaints}
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

export const createComplaintColumns = (
  basePath: string,
  showActions = false,
): ColumnDef<ComplaintType>[] => [
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
    id: "title",
    header: () => <span className="text-xs">TITLE</span>,
    cell: ({ row }) => (
      <p className="line-clamp-2 flex items-center gap-2 text-sm">
        {row.original.title}
      </p>
    ),
  },
  {
    accessorKey: "status",
    header: ({ column }) => <TableSorter column={column} header="STATUS" />,
    cell: ({ row }) => {
      const status = row.original.status;
      const map = {
        PENDING:
          "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
        FINISHED:
          "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
        CANCELLED:
          "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
      } as const;
      const label = {
        PENDING: "Menunggu",
        FINISHED: "Selesai",
        CANCELLED: "Dibatalkan",
      } as const;
      return (
        <span
          className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${map[status]}`}
        >
          {label[status]}
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
    cell: ({ row }: { row: { original: ComplaintType } }) => (
      <div className="flex items-center gap-1">
        <Link
          href={`${basePath}/${row.original.id}`}
          className="text-muted-foreground hover:text-foreground inline-flex h-8 w-8 items-center justify-center rounded-md transition-colors"
        >
          <Eye className="h-4 w-4" />
        </Link>
        {showActions && <ComplaintRowActions complaint={row.original} />}
      </div>
    ),
  } as ColumnDef<ComplaintType>,
];
