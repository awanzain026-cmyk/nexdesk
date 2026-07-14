import Sidebar from "@/components/layout/Sidebar";
import DashboardHeader from "@/components/layout/Header";
import { ToastProvider } from "@/components/ui";
import { AuthProvider } from "@/components/AuthProvider";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <ToastProvider>
        <div className="flex h-screen overflow-hidden">
          <Sidebar user={{ full_name: "Admin", email: "admin@techvault.com" }} />
          <div className="flex-1 flex flex-col overflow-hidden">
            <DashboardHeader />
            <main className="flex-1 overflow-y-auto grid-bg">
              <div className="max-w-7xl mx-auto px-6 py-6">
                {children}
              </div>
            </main>
          </div>
        </div>
      </ToastProvider>
    </AuthProvider>
  );
}
