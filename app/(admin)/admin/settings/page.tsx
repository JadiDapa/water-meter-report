import { getCurrentUser } from "@/app/actions/user.actions";
import PageHeader from "@/components/root/PageHeader";
import DynamicBreadcrumb from "@/components/root/DynamicBreadcrumb";
import { UserProfile } from "@clerk/nextjs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function AdminSettingsPage() {
  const user = await getCurrentUser();

  return (
    <main className="min-h-screen w-full space-y-6">
      <div className="space-y-2">
        <DynamicBreadcrumb />
        <PageHeader title="Pengaturan" subtitle="Kelola profil dan keamanan akun" />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-base">Informasi Profil</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <p className="text-muted-foreground text-xs">Nama</p>
              <p className="font-medium">{user.name}</p>
            </div>
            <div>
              <p className="text-muted-foreground text-xs">Username</p>
              <p className="font-medium">{user.username}</p>
            </div>
            <div>
              <p className="text-muted-foreground text-xs">Role</p>
              <span className="bg-primary/10 text-primary rounded-md px-2 py-1 text-xs font-medium">
                {user.role}
              </span>
            </div>
          </CardContent>
        </Card>

        <div className="lg:col-span-2">
          <UserProfile routing="hash" />
        </div>
      </div>
    </main>
  );
}
