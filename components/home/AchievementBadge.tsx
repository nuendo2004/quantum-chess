export default function AchievementBadge({
  title,
  unlocked,
  icon,
}: {
  title: string;
  unlocked: boolean;
  icon: string;
}) {
  return (
    <div
      className={`p-4 text-center rounded-xl ${
        unlocked
          ? "bg-green-100 dark:bg-green-900"
          : "bg-gray-100 dark:bg-slate-700 opacity-50"
      }`}
    >
      <div className="text-4xl mb-2">{icon}</div>
      <h5
        className={`font-medium ${
          unlocked
            ? "text-green-700 dark:text-green-300"
            : "text-gray-500 dark:text-gray-400"
        }`}
      >
        {title}
      </h5>
      <div className="text-sm mt-1">{unlocked ? "Unlocked!" : "Locked"}</div>
    </div>
  );
}
