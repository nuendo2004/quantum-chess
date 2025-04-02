import { motion } from "framer-motion";
interface StatCardProps {
  icon: React.ReactNode;
  title: string;
  value: string | number;
  color: string;
}

function StatCard({ icon, title, value, color }: StatCardProps) {
  return (
    <motion.div
      className={`${color} p-6 rounded-xl flex items-center gap-4 shadow`}
      whileHover={{ scale: 1.02 }}
    >
      <div className="p-3 bg-white/70 dark:bg-slate-700/70 rounded-lg flex-shrink-0">
        {icon}
      </div>
      <div>
        <h3 className="text-gray-600 dark:text-gray-300 text-sm font-medium">
          {title}
        </h3>
        <p className="text-2xl font-bold dark:text-white">{value}</p>
      </div>
    </motion.div>
  );
}

export default StatCard;
