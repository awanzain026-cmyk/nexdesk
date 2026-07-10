"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Zap, Mail, Lock, User, AlertCircle, MailCheck } from "lucide-react";
import { Button, Input } from "@/components/ui";
import { createClient } from "@/lib/supabase/client";

export default function SignupPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    setLoading(true);
    const supabase = createClient();
    const { data, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: fullName } },
    });
    setLoading(false);

    if (authError) {
      setError(authError.message);
      return;
    }

    // If Supabase's "Confirm email" setting is on, there's no session yet --
    // the user must click the link Supabase just emailed them.
    if (data.user && !data.session) {
      setSubmitted(true);
      return;
    }

    // Confirm-email is off: they're logged in immediately.
    window.location.href = "/dashboard";
  };

  if (submitted) {
    return (
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 text-center">
        <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald/15 mb-2">
          <MailCheck className="h-6 w-6 text-emerald" />
        </div>
        <h1 className="text-2xl font-bold text-text-primary">Check your email</h1>
        <p className="text-sm text-text-muted max-w-xs mx-auto">
          We sent a confirmation link to <span className="text-text-primary">{email}</span>. Click it to activate your account, then sign in.
        </p>
        <Link href="/login" className="text-cyan hover:underline text-sm">Back to sign in</Link>
      </motion.div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="text-center">
        <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan shadow-glow-cyan mb-4">
          <Zap className="h-6 w-6 text-void" />
        </div>
        <h1 className="text-2xl font-bold text-text-primary">Create account</h1>
        <p className="text-sm text-text-muted mt-1">Get started with NexDesk</p>
      </div>
      <div className="card-static rounded-2xl p-8">
        <form onSubmit={handleSignup} className="space-y-4">
          <Input label="Full Name" type="text" value={fullName} onChange={e => setFullName(e.target.value)} icon={<User className="h-4 w-4" />} placeholder="Your name" required />
          <Input label="Email" type="email" value={email} onChange={e => setEmail(e.target.value)} icon={<Mail className="h-4 w-4" />} placeholder="you@company.com" required />
          <Input label="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} icon={<Lock className="h-4 w-4" />} placeholder="Min. 8 characters" required />

          {error && (
            <div className="flex items-start gap-2 rounded-lg bg-rose/10 border border-rose/20 p-3">
              <AlertCircle className="h-4 w-4 text-rose flex-shrink-0 mt-0.5" />
              <p className="text-xs text-rose">{error}</p>
            </div>
          )}

          <Button type="submit" loading={loading} className="w-full mt-2">Create Account</Button>
        </form>
        <p className="text-center text-xs text-text-muted mt-5">
          Already have an account? <Link href="/login" className="text-cyan hover:underline">Sign in</Link>
        </p>
      </div>
    </motion.div>
  );
}
