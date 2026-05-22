import { getCurrentUser } from "@/app/actions/user.actions";
import { redirect } from "next/navigation";

export default async function RootPage() {
  const user = await getCurrentUser();

  if (user.role === "ADMIN") redirect("/admin");
  if (user.role === "TECHNICIAN") redirect("/technician");
  redirect("/customer");
}
