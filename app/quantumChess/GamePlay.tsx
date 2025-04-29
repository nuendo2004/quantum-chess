import React from "react";
import {
  HiOutlineUserCircle,
  HiOutlineChip,
  HiOutlineScale,
  HiOutlineArrowLeft,
} from "react-icons/hi";
import useGameStore from "@/store/gamesStore";

const MAX_QUANTUM_ENERGY = 100;

const GamePlay: React.FC = () => {
  const {
    currentPlayer,
    gameScore: score,
    playerColor,
    lastMove,
    initializeSuperposition,
    initializeEntanglement,
    playerQuantumEnergy,
    selectedPiece,
  } = useGameStore((state) => state);

  const scoreColor =
    score > 0
      ? "text-green-600 dark:text-green-400"
      : score < 0
      ? "text-red-600 dark:text-red-400"
      : "text-gray-700 dark:text-gray-200";

  const PlayerIcon =
    currentPlayer === playerColor ? HiOutlineUserCircle : HiOutlineChip;

  const energyPercent =
    (Math.min(playerQuantumEnergy, MAX_QUANTUM_ENERGY) / MAX_QUANTUM_ENERGY) *
    100;

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-6">
      <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-100 border-b pb-2 dark:border-gray-600">
        Game Status
      </h2>

      <div className="space-y-4 text-gray-600 dark:text-gray-300">
        {/* Score Display */}
        <div className="flex items-center justify-between gap-2 text-2xl">
          <div className="flex items-center gap-2">
            <HiOutlineScale className="h-7 w-7 flex-shrink-0" />
            <span>Score:</span>
          </div>
          <span className={`font-bold text-2xl ${scoreColor}`}>
            {score >= 0 ? `+${score}` : score}
          </span>
        </div>

        {/* Current Turn */}
        <div className="flex lg:flex-col justify-between gap-2 text-2xl">
          <div className="flex items-center gap-2">
            <PlayerIcon className="h-7 w-7 flex-shrink-0" />
            <span>Current Turn:</span>
          </div>
          <div className="font-medium text-gray-800 dark:text-gray-100 self-center">
            {currentPlayer === "white" ? "Player" : "AI"} ({playerColor})
          </div>
        </div>

        {/* Last Move */}
        <div className="flex lg:flex-col justify-between gap-2 text-xl">
          <div className="flex items-center gap-2">
            <HiOutlineArrowLeft className="h-5 w-5 flex-shrink-0" />
            <span>Opponent&apos;s Last Move:</span>
          </div>
          <span
            className="font-mono text-xl text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-slate-700 px-2 py-1 rounded truncate max-w-[150px] sm:max-w-[250px]"
            title={lastMove ? `From ${lastMove.from} to ${lastMove.to}` : "N/A"}
          >
            {lastMove ? `From ${lastMove.from} to ${lastMove.to}` : "N/A"}
          </span>
        </div>

        {/* Energy Bar */}
        <div className="mt-4">
          <div className="flex justify-between mb-1">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Energy
            </span>
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {playerQuantumEnergy}/{MAX_QUANTUM_ENERGY}
            </span>
          </div>
          <div className="w-full h-3 bg-gray-200 dark:bg-gray-700 rounded">
            <div
              className="h-3 bg-green-500 rounded"
              style={{ width: `${energyPercent}%` }}
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-4 mt-4">
          <button
            disabled={playerQuantumEnergy < MAX_QUANTUM_ENERGY}
            onClick={() => initializeSuperposition(selectedPiece!)}
            className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-700 transition"
          >
            Superposition Move
          </button>
          <button
            disabled={playerQuantumEnergy < MAX_QUANTUM_ENERGY}
            onClick={() => initializeEntanglement(selectedPiece!)}
            className="px-4 py-2 bg-purple-600 text-white rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-purple-700 transition"
          >
            Entanglement Move
          </button>
        </div>
      </div>
    </div>
  );
};

export default GamePlay;
