import { ReactNode } from "react";
import { motion } from "framer-motion";

export default function GameCard({
  title,
  icon,
  description,
  bgColor,
}: {
  title: string;
  icon: ReactNode;
  description: string;
  bgColor: string;
}) {
  return (
    <motion.div
      className={`${bgColor} p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow dark:bg-opacity-50`}
      whileHover={{ scale: 1.02 }}
    >
      <div className="w-12 h-12 mb-4 flex items-center justify-center bg-white rounded-lg dark:bg-slate-700">
        {icon}
      </div>
      <h4 className="text-xl font-semibold mb-2 dark:text-white">{title}</h4>
      <p className="text-gray-600 dark:text-gray-400">{description}</p>
      <button className="mt-6 bg-purple-600 text-white px-6 py-2 rounded-full">
        Play Now
      </button>
    </motion.div>
  );
}
