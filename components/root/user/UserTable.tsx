"use client";

import { ColumnDef } from "@tanstack/react-table";
import DataTable from "../DataTable";
import SearchDataTable from "../SearchDataTable";
import TableSorter from "../TableSorter";
import { UserType } from "@/servers/validators/user.validator";
import UserRowActions from "./UserRowActions";

interface UserTableProps {
  users: UserType[];
}

export default function UserTable({ users }: UserTableProps) {
  return (
    <DataTable
      columns={userColumns}
      data={users}
      filters={(table) => (
        <div className="grid w-full items-end gap-4 p-4 lg:grid-cols-3 lg:gap-6">
          <SearchDataTable
            table={table}
            column="user"
            placeholder="Search User Name..."
          />
          <SearchDataTable
            table={table}
            column="role"
            placeholder="Search Role..."
          />
        </div>
      )}
    />
  );
}

export const userColumns: ColumnDef<UserType>[] = [
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
    id: "user",
    accessorFn: (row) => `${row.name} ${row.username}`,
    header: ({ column }) => <TableSorter column={column} header="USER" />,
    cell: ({ row }) => {
      const name = row.original.name;
      const firstName = name.split(" ")[0];

      return (
        <div className="flex items-center gap-3">
          <div className="bg-primary/10 text-primary flex h-9 w-9 items-center justify-center rounded-full text-sm font-semibold">
            {firstName.charAt(0)}
          </div>
          <div className="flex flex-col leading-tight">
            <span className="font-medium">{name}</span>
            <span className="text-muted-foreground text-xs">
              {row.original.username}
            </span>
          </div>
        </div>
      );
    },
  },

  {
    accessorKey: "role",
    header: ({ column }) => <TableSorter column={column} header="ROLE" />,
    cell: ({ row }) => (
      <span className="text-muted-foreground font-mono text-xs">
        {row.original.role}
      </span>
    ),
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
    cell: ({ row }) => <UserRowActions user={row.original} />,
  },
];
