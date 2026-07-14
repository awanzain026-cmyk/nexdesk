import { AuthProvider } from "@/components/AuthProvider";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <div className="min-h-screen flex items-center justify-center px-4 grid-bg">
        <div className="w-full max-w-md">{children}</div>
      </div>
    </AuthProvider>
  );
}
