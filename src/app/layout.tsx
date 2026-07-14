import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { Analytics } from "@vercel/analytics/react";
import "./globals.css";

const siteUrl = "https://nexdesk-cyan.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: "NexDesk — AI Customer Support", template: "%s | NexDesk" },
  description: "Enterprise AI-powered customer support platform for TechVault electronics store.",
  keywords: ["AI", "customer support", "helpdesk", "electronics", "multi-agent"],
  openGraph: {
    title: "NexDesk — AI Customer Support",
    description: "8 specialized AI agents handling customer support end-to-end. Live demo.",
    url: siteUrl,
    siteName: "NexDesk",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "NexDesk — AI Customer Support",
    description: "8 specialized AI agents handling customer support end-to-end. Live demo.",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable} h-full`}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="ambient-bg min-h-full antialiased">
        {children}
        <Analytics />
      </body>
    </html>
  );
}
