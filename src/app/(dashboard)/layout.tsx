import Sidebar from "@/components/layout/Sidebar";
import DashboardHeader from "@/components/layout/Header";
import { ToastProvider } from "@/components/ui";
import { createClient } from "@/lib/supabase/server";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <ToastProvider>
      <div className="flex h-screen overflow-hidden">
        <Sidebar user={{ full_name: user?.user_metadata?.full_name ?? null, email: user?.email ?? "" }} />
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
  );
}
