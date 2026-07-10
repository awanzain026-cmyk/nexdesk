import Sidebar from "@/components/layout/Sidebar";
import DashboardHeader from "@/components/layout/Header";
import { ToastProvider } from "@/components/ui";
import { createClient } from "@/lib/supabase/server";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  let userInfo = { full_name: null as string | null, email: "" };

  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    userInfo = { full_name: user?.user_metadata?.full_name ?? null, email: user?.email ?? "" };
  } catch (err) {
    // proxy.ts already gates this route -- if we somehow get here without a
    // valid session, degrade to an empty user rather than crashing the page.
    console.error("[dashboard layout] Failed to load user, degrading gracefully:", err);
  }

  return (
    <ToastProvider>
      <div className="flex h-screen overflow-hidden">
        <Sidebar user={userInfo} />
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
