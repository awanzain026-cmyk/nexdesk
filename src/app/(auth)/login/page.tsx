"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Zap, Mail, Lock, Eye, EyeOff } from "lucide-react";
import { Button, Input } from "@/components/ui";

export default function LoginPage() {
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("admin@techvault.com");
  const [password, setPassword] = useState("nexdesk2025");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Demo: skip real auth, go straight to dashboard
    await new Promise(r => setTimeout(r, 800));
    router.push("/dashboard");
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      {/* Logo */}
      <div className="text-center">
        <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan to-violet shadow-glow-cyan mb-4">
          <Zap className="h-6 w-6 text-void" />
        </div>
        <h1 className="text-2xl font-bold text-text-primary">Welcome back</h1>
        <p className="text-sm text-text-muted mt-1">Sign in to NexDesk</p>
      </div>

      <div className="card-static rounded-2xl p-8">
        <form onSubmit={handleLogin} className="space-y-4">
          <Input label="Email" type="email" value={email} onChange={e => setEmail(e.target.value)} icon={<Mail className="h-4 w-4" />} placeholder="admin@techvault.com" />
          <div>
            <label className="block text-xs font-medium text-text-secondary mb-1.5">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted" />
              <input type={showPass ? "text" : "password"} value={password} onChange={e => setPassword(e.target.value)}
                className="input-field pl-9 pr-10" placeholder="••••••••" />
              <button type="button" onClick={() => setShowPass(!showPass)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary transition-colors cursor-pointer">
                {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>
          <Button type="submit" loading={loading} className="w-full mt-2">Sign In</Button>
        </form>
        <p className="text-center text-xs text-text-muted mt-5">
          Demo credentials pre-filled. <Link href="/signup" className="text-cyan hover:underline">Create account</Link>
        </p>
      </div>

      <div className="card-static rounded-xl p-4 flex items-start gap-3">
        <div className="h-2 w-2 rounded-full bg-emerald mt-1.5 flex-shrink-0 shadow-[0_0_6px_rgba(0,229,160,0.6)]" />
        <div>
          <p className="text-xs font-medium text-text-primary">Demo Mode Active</p>
          <p className="text-[11px] text-text-muted mt-0.5">No Supabase setup needed. Click Sign In to access the full dashboard with all 8 AI agents.</p>
        </div>
      </div>
    </motion.div>
  );
}
