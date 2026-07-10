"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Zap, Mail, Lock, Eye, EyeOff, AlertCircle } from "lucide-react";
import { Button, Input } from "@/components/ui";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const supabase = createClient();
      const { error: authError } = await supabase.auth.signInWithPassword({ email, password });

      if (authError) {
        setError(authError.message === "Invalid login credentials"
          ? "Incorrect email or password."
          : authError.message);
        return;
      }

      const redirectTo = searchParams.get("redirectTo") || "/dashboard";
      router.push(redirectTo);
      router.refresh();
    } catch (err) {
      console.error("[login] Unexpected error:", err);
      setError(
        err instanceof Error
          ? `Something went wrong: ${err.message}. Check your connection and try again.`
          : "Something went wrong. Check your connection and try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="text-center">
        <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan shadow-glow-cyan mb-4">
          <Zap className="h-6 w-6 text-void" />
        </div>
        <h1 className="text-2xl font-bold text-text-primary">Welcome back</h1>
        <p className="text-sm text-text-muted mt-1">Sign in to NexDesk</p>
      </div>

      <div className="card-static rounded-2xl p-8">
        <form onSubmit={handleLogin} className="space-y-4">
          <Input label="Email" type="email" value={email} onChange={e => setEmail(e.target.value)} icon={<Mail className="h-4 w-4" />} placeholder="you@company.com" required />
          <div>
            <label className="block text-xs font-medium text-text-secondary mb-1.5">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted" />
              <input type={showPass ? "text" : "password"} value={password} onChange={e => setPassword(e.target.value)}
                className="input-field pl-9 pr-10" placeholder="••••••••" required />
              <button type="button" onClick={() => setShowPass(!showPass)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary transition-colors cursor-pointer">
                {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {error && (
            <div className="flex items-start gap-2 rounded-lg bg-rose/10 border border-rose/20 p-3">
              <AlertCircle className="h-4 w-4 text-rose flex-shrink-0 mt-0.5" />
              <p className="text-xs text-rose">{error}</p>
            </div>
          )}

          <Button type="submit" loading={loading} className="w-full mt-2">Sign In</Button>
        </form>
        <p className="text-center text-xs text-text-muted mt-5">
          Don&apos;t have an account? <Link href="/signup" className="text-cyan hover:underline">Create account</Link>
        </p>
      </div>
    </motion.div>
  );
}
