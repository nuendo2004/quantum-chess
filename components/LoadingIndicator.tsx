"use client";

interface LoadingIndicatorProps {
  message?: string;
}

export default function LoadingIndicator({
  message = "Loading Profile...",
}: LoadingIndicatorProps) {
  return (
    <div
      className="min-h-screen flex justify-center items-center bg-gradient-to-b from-indigo-50 to-purple-50 dark:from-slate-900 dark:to-slate-800"
      data-testid="loading-indicator"
    >
      <p className="text-xl dark:text-white animate-pulse">{message}</p>
    </div>
  );
}
