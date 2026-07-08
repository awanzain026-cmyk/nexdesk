import { Zap } from "lucide-react";

export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="relative">
          <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-cyan to-violet flex items-center justify-center animate-pulse">
            <Zap className="h-6 w-6 text-void" />
          </div>
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-cyan to-violet opacity-20 blur-xl animate-pulse" />
        </div>
        <p className="text-sm text-text-muted animate-pulse">Loading NexDesk...</p>
      </div>
    </div>
  );
}
