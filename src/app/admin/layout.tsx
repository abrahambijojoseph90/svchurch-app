import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import AdminSessionProvider from "@/components/AdminSessionProvider";
import AdminSidebar from "@/components/AdminSidebar";
import AdminHeader from "@/components/AdminHeader";

export const metadata = {
  title: "Admin | Spring Valley Church",
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/admin-login");
  }

  return (
    <AdminSessionProvider>
      <div className="min-h-screen flex bg-gray-100">
        {/* Sidebar */}
        <AdminSidebar />

        {/* Main Content */}
        <div className="flex-1 flex flex-col ml-64">
          <AdminHeader userName={session.user?.name || "Admin"} />
          <main className="flex-1 p-6">{children}</main>
        </div>
      </div>
    </AdminSessionProvider>
  );
}
