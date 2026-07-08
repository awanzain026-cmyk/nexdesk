"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Zap, Mail, Lock, User } from "lucide-react";
import { Button, Input } from "@/components/ui";

export default function SignupPage() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise(r => setTimeout(r, 1000));
    router.push("/dashboard");
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="text-center">
        <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan to-violet shadow-glow-cyan mb-4">
          <Zap className="h-6 w-6 text-void" />
        </div>
        <h1 className="text-2xl font-bold text-text-primary">Create account</h1>
        <p className="text-sm text-text-muted mt-1">Get started with NexDesk</p>
      </div>
      <div className="card-static rounded-2xl p-8">
        <form onSubmit={handleSignup} className="space-y-4">
          <Input label="Full Name" type="text" icon={<User className="h-4 w-4" />} placeholder="Your name" />
          <Input label="Email" type="email" icon={<Mail className="h-4 w-4" />} placeholder="you@company.com" />
          <Input label="Password" type="password" icon={<Lock className="h-4 w-4" />} placeholder="Min. 8 characters" />
          <Button type="submit" loading={loading} className="w-full mt-2">Create Account</Button>
        </form>
        <p className="text-center text-xs text-text-muted mt-5">
          Already have an account? <Link href="/login" className="text-cyan hover:underline">Sign in</Link>
        </p>
      </div>
    </motion.div>
  );
}
