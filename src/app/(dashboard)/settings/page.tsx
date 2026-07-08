"use client";
import { motion } from "framer-motion";
import { Card, Input, Button } from "@/components/ui";
import { Settings, Store, Bell, Shield, Zap } from "lucide-react";
import { STORE_NAME } from "@/lib/data/products";

export default function SettingsPage() {
  return (
    <div className="space-y-6 max-w-3xl">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-text-primary tracking-tight">Settings</h1>
        <p className="text-sm text-text-muted mt-0.5">Configure your NexDesk platform</p>
      </motion.div>

      {[
        { icon: <Store className="h-4 w-4 text-cyan" />, title: "Store Information", fields: [
          { label: "Store Name", placeholder: "TechVault", defaultValue: STORE_NAME },
          { label: "Support Email", placeholder: "support@techvault.com", defaultValue: "support@techvault.com" },
          { label: "Business Hours", placeholder: "Mon-Fri 9AM-6PM EST", defaultValue: "Mon-Fri 9AM-6PM EST" },
        ]},
        { icon: <Zap className="h-4 w-4 text-violet" />, title: "AI Agent Settings", fields: [
          { label: "Max Off-Topic Warnings", placeholder: "3", defaultValue: "3" },
          { label: "Escalation Threshold (turns)", placeholder: "3", defaultValue: "3" },
          { label: "Response Language", placeholder: "English", defaultValue: "English" },
        ]},
        { icon: <Bell className="h-4 w-4 text-amber" />, title: "Notifications", fields: [
          { label: "Urgent Ticket Email", placeholder: "admin@techvault.com", defaultValue: "admin@techvault.com" },
          { label: "Daily Report Email", placeholder: "admin@techvault.com", defaultValue: "admin@techvault.com" },
        ]},
      ].map((section, i) => (
        <motion.div key={section.title} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
          <Card hover={false}>
            <div className="flex items-center gap-2 mb-4 pb-4 border-b border-border">
              {section.icon}
              <h2 className="text-sm font-semibold text-text-primary">{section.title}</h2>
            </div>
            <div className="space-y-4">
              {section.fields.map(f => (
                <Input key={f.label} label={f.label} placeholder={f.placeholder} defaultValue={f.defaultValue} />
              ))}
            </div>
            <div className="mt-5 pt-4 border-t border-border flex justify-end">
              <Button variant="secondary" size="sm">Save Changes</Button>
            </div>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}
