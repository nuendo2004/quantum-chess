export default function ResourceCard({
  title,
  type,
  difficulty,
}: {
  title: string;
  type: string;
  difficulty: string;
}) {
  return (
    <div className="bg-white dark:bg-slate-700 p-6 rounded-xl hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <span className="text-sm text-purple-600 dark:text-purple-400">
          {type}
        </span>
        <span className="px-2 py-1 text-xs bg-purple-100 dark:bg-purple-900 rounded-full">
          {difficulty}
        </span>
      </div>
      <h4 className="text-lg font-semibold mb-2 dark:text-white">{title}</h4>
      <button className="text-purple-600 dark:text-purple-400 hover:underline">
        View Resource →
      </button>
    </div>
  );
}
