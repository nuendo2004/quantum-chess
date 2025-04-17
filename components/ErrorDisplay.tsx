"use client";

interface ErrorDisplayProps {
  error: string | null;
}

export default function ErrorDisplay({ error }: ErrorDisplayProps) {
  return (
    <div
      className="min-h-screen flex justify-center items-center bg-gradient-to-b from-indigo-50 to-purple-50 dark:from-slate-900 dark:to-slate-800"
      data-testid="error-display"
    >
      <p className="text-xl text-red-600 dark:text-red-400">
        Error: {error || "An unknown error occurred."}
      </p>
    </div>
  );
}
