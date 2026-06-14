import { ReactNode } from "react";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/app/actions/user.actions";
import CustomerNavbar from "@/components/root/CustomerNavbar";

export default async function CustomerLayout({
  children,
}: {
  children: ReactNode;
}) {
  const user = await getCurrentUser();

  if (user.role !== "CUSTOMER") redirect("/");

  return (
    <div className="bg-background min-h-screen">
      <CustomerNavbar user={user} />
      <main className="mx-auto max-w-5xl py-8">{children}</main>
    </div>
  );
}
