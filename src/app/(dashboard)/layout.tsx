import Sidebar from "@/components/layout/Sidebar";
import { ToastProvider } from "@/components/ui";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <ToastProvider>
      <div className="flex h-screen overflow-hidden">
        <Sidebar user={{ full_name: "Admin", email: "admin@techvault.com" }} />
        <main className="flex-1 overflow-y-auto grid-bg">
          <div className="max-w-7xl mx-auto px-6 py-6">
            {children}
          </div>
        </main>
      </div>
    </ToastProvider>
  );
}
