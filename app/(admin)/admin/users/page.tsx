import PageHeader from "@/components/root/PageHeader";
import { UserService } from "@/servers/services/user.service";
import DynamicBreadcrumb from "@/components/root/DynamicBreadcrumb";
import CreateUserDialog from "@/components/root/user/CreateUserDialog";
import ImportUsersDialog from "@/components/root/user/ImportUsersDialog";
import UserStats from "@/components/root/user/UserStats";
import UserTable from "@/components/root/user/UserTable";

export default async function AdminUsersPage() {
  const users = await UserService.getAll();

  return (
    <main className="min-h-screen w-full space-y-6 md:rounded-2xl">
      <div className="flex flex-col items-start gap-4 justify-between lg:flex-row lg:items-center">
        <div className="space-y-2">
          <DynamicBreadcrumb />
          <PageHeader title="Daftar Pengguna" subtitle="Kelola semua pengguna" />
        </div>
        <div className="flex w-full items-center gap-2 sm:w-auto">
          <ImportUsersDialog />
          <CreateUserDialog />
        </div>
      </div>

      <UserStats users={users} />

      <div className="space-y-2">
        <h2 className="text-foreground text-xl font-medium tracking-tight">
          Daftar Pengguna
        </h2>
        <UserTable users={users} />
      </div>
    </main>
  );
}
