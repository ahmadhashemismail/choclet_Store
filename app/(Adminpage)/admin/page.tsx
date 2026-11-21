import { auth } from "@clerk/nextjs/server";
import { notFound } from "next/navigation";
import { isAdminUser } from "@/lib/auth/admin";
import AdminDashboard from "./dashboard/page";

export default async function AdminPage() {
  await auth.protect({ unauthenticatedUrl: "/auth" });
  if (!(await isAdminUser())) notFound();
  return <AdminDashboard />;
}
