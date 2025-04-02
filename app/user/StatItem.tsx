interface StatItemProps {
  label: string;
  value: string | number;
}
function StatItem({ label, value }: StatItemProps) {
  return (
    <li className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-slate-700 last:border-b-0">
      <span className="text-gray-600 dark:text-gray-300 text-sm">{label}</span>
      <span className="font-medium dark:text-white text-sm">{value}</span>
    </li>
  );
}

export default StatItem;
