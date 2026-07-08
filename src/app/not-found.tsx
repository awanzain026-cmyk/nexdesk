"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import { Zap, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center max-w-md">
        <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan/20 to-violet/20 border border-cyan/20 mb-6">
          <Zap className="h-8 w-8 text-cyan" />
        </div>
        <h1 className="text-6xl font-bold font-mono gradient-text-cyan mb-4">404</h1>
        <h2 className="text-xl font-semibold text-text-primary mb-3">Page Not Found</h2>
        <p className="text-text-muted text-sm mb-8">The page you're looking for doesn't exist or has been moved.</p>
        <Link href="/dashboard">
          <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="btn-primary">
            <ArrowLeft className="h-4 w-4" /> Back to Dashboard
          </motion.button>
        </Link>
      </motion.div>
    </div>
  );
}
