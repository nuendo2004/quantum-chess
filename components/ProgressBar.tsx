import React from "react";
import { motion } from "framer-motion";

interface ProgressBarProps {
  label: string;
  progress: number;
  color: string;
}

function ProgressBar({ label, progress, color }: ProgressBarProps) {
  const safeProgress = Math.max(0, Math.min(100, progress)); // progress 0-100

  return (
    <div>
      <div className="flex justify-between mb-1 text-sm">
        {" "}
        <span className="font-medium dark:text-gray-300">{label}</span>
        <span className="font-medium text-gray-500 dark:text-gray-400">
          {safeProgress}%
        </span>
      </div>
      <div className="h-2.5 bg-gray-200 dark:bg-slate-700 rounded-full overflow-hidden">
        {" "}
        <motion.div
          className={`h-full ${color}`}
          initial={{ width: 0 }}
          animate={{ width: `${safeProgress}%` }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        />
      </div>
    </div>
  );
}

export default ProgressBar;
