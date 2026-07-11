import Link from "next/link";
import { Zap } from "lucide-react";

export const metadata = { title: "Privacy Policy" };

export default function PrivacyPage() {
  return (
    <div className="min-h-screen px-6 py-16">
      <div className="max-w-2xl mx-auto">
        <Link href="/" className="inline-flex items-center gap-2 mb-10">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-cyan">
            <Zap className="h-3.5 w-3.5 text-void" />
          </div>
          <span className="font-medium text-text-primary">NexDesk</span>
        </Link>

        <h1 className="font-[family-name:var(--font-display)] text-3xl text-text-primary mb-2">Privacy Policy</h1>
        <p className="text-sm text-text-muted mb-10">Last updated: July 2026</p>

        <div className="space-y-8 text-sm text-text-secondary leading-relaxed">
          <section>
            <h2 className="text-text-primary font-medium mb-2">What this is</h2>
            <p>NexDesk is a demonstration AI customer support platform built for a fictional store, TechVault. This policy explains what happens with your data when you use the live chat demo or dashboard.</p>
          </section>

          <section>
            <h2 className="text-text-primary font-medium mb-2">What we collect</h2>
            <p>When you use the live chat, your messages and any information you type (such as an order number or product question) may be stored in a database to power the dashboard and ticket history shown in this demo. We do not collect payment information — this demo does not process real payments.</p>
          </section>

          <section>
            <h2 className="text-text-primary font-medium mb-2">How it&apos;s used</h2>
            <p>Chat messages are sent to a third-party AI provider to generate responses. Ticket and message data is used solely to power the dashboard views within this demo and is not sold or shared with any other party.</p>
          </section>

          <section>
            <h2 className="text-text-primary font-medium mb-2">Your choices</h2>
            <p>Avoid entering real personal or sensitive information into the chat demo. If you&apos;d like data associated with a conversation removed, contact us using the email below.</p>
          </section>

          <section>
            <h2 className="text-text-primary font-medium mb-2">Contact</h2>
            <p>Questions about this policy: <a href="mailto:zainmalik.622aa@gmail.com" className="text-cyan hover:underline">zainmalik.622aa@gmail.com</a></p>
          </section>
        </div>
      </div>
    </div>
  );
}
