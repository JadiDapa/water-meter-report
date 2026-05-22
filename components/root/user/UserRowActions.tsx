"use client";

import EditUserDialog from "./EditUserDialog";
import DeleteConfirmDialog from "../DeleteConfirmDialog";
import { deleteUser } from "@/app/actions/user.actions";

interface Props {
  user: { id: number; name: string; username: string; role: string };
}

export default function UserRowActions({ user }: Props) {
  return (
    <div className="flex items-center gap-1">
      <EditUserDialog user={user} />
      <DeleteConfirmDialog
        onDelete={() => deleteUser(user.id)}
        label="pengguna ini"
      />
    </div>
  );
}
