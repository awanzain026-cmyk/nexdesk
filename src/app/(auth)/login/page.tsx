"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { Zap, Clock, ArrowRight } from "lucide-react";

export default function LoginPage() {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 text-center">
      <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan shadow-glow-cyan mb-2">
        <Zap className="h-6 w-6 text-void" />
      </div>
      <h1 className="text-2xl font-bold text-text-primary">Accounts coming soon</h1>
      <p className="text-sm text-text-muted max-w-xs mx-auto leading-relaxed">
        Customer and admin accounts are still being built. For now, jump straight into the demo below.
      </p>
      <div className="card-static rounded-2xl p-6 flex flex-col gap-3">
        <Link href="/dashboard">
          <button className="btn-primary w-full">
            <Clock className="h-4 w-4" /> View Dashboard <ArrowRight className="h-4 w-4" />
          </button>
        </Link>
        <Link href="/chat">
          <button className="btn-secondary w-full">Try Live Chat</button>
        </Link>
      </div>
    </motion.div>
  );
}
