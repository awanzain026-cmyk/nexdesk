"use client";
import { useEffect } from "react";

export default function ErrorPage({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error("[Global Error]", error);
  }, [error]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-4">
      <div className="p-4 rounded-2xl bg-rose/10 border border-rose/20 mb-4">
        <svg className="h-10 w-10 text-rose" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
        </svg>
      </div>
      <h1 className="text-2xl font-bold text-text-primary mb-2">Unexpected Error</h1>
      <p className="text-sm text-text-muted max-w-md mb-6">
        Something went wrong. Try refreshing or go back to the dashboard.
      </p>
      <div className="flex gap-3">
        <button onClick={reset} className="btn-primary text-sm">
          Try Again
        </button>
        <a href="/dashboard" className="btn-secondary text-sm">
          Go to Dashboard
        </a>
      </div>
    </div>
  );
}
