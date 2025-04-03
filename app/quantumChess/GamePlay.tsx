import React from "react";
import {
  ScaleIcon,
  UserCircleIcon,
  CpuChipIcon,
  ArrowUturnLeftIcon,
} from "@heroicons/react/24/outline";
import useGameStore from "@/store/gamesStore";

const GamePlay: React.FC = () => {
  const {
    currentPlayer,
    gameScore: score,
    playerColor,
    lastMove,
  } = useGameStore((state) => state);

  const scoreColor =
    score > 0
      ? "text-green-600 dark:text-green-400"
      : score < 0
      ? "text-red-600 dark:text-red-400"
      : "text-gray-700 dark:text-gray-200";

  const PlayerIcon =
    currentPlayer === playerColor ? UserCircleIcon : CpuChipIcon;

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-6">
      <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-100 border-b pb-2 dark:border-gray-600">
        Game Status
      </h2>
      <div className="space-y-4 text-gray-600 dark:text-gray-300">
        <div className="flex items-center justify-between gap-2 text-2xl">
          <div className="flex items-center gap-2">
            <ScaleIcon className="h-7 w-7 flex-shrink-0" />
            <span>Score:</span>
          </div>
          <span className={`font-bold text-2xl ${scoreColor}`}>
            {score >= 0 ? `+${score}` : score}
          </span>
        </div>

        <div className="flex lg:flex-col justify-between gap-2 text-2xl">
          <div className="flex items-center gap-2 ">
            <PlayerIcon className="h-7 w-7  flex-shrink-0" />
            <span>Current Turn:</span>
          </div>
          <div className="font-medium text-gray-800 dark:text-gray-100 self-center">
            {currentPlayer === "white" ? "Player" : "AI"} ({playerColor})
          </div>
        </div>

        <div className="flex lg:flex-col justify-between gap-2 text-xl">
          <div className="flex items-center gap-2">
            <ArrowUturnLeftIcon className="h-5 w-5 flex-shrink-0" />
            <span>Opponent&apos;s Last Move:</span>
          </div>
          <span
            className="font-mono text-xl text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-slate-700 px-2 py-1 rounded truncate max-w-[150px] sm:max-w-[250px]"
            title={lastMove ? `From ${lastMove.from} to ${lastMove.to}` : "N/A"}
          >
            {lastMove ? `From ${lastMove.from} to ${lastMove.to}` : "N/A"}
          </span>
        </div>
      </div>
    </div>
  );
};

export default GamePlay;
