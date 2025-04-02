import React from "react";
import StatItem from "./StatItem";
import { initialProfileData } from "./page";
import { formatSecondsToTime } from "@/libs/utils";
import { GameProfile } from "@prisma/client";

const GameStats = ({ gameProfile }: { gameProfile: GameProfile | null }) => {
  const profileData = gameProfile ?? initialProfileData;
  const totalGames = gameProfile?.quantumChessTotalGames ?? 0;
  const wins = gameProfile?.quantumChessWins ?? 0;
  const winRate =
    totalGames > 0 ? ((wins / totalGames) * 100).toFixed(0) + "%" : "0%";

  return (
    <div className="grid md:grid-cols-2 gap-6 mt-8">
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-6">
        <h3 className="text-xl font-bold mb-4 dark:text-white">
          Quantum Chess Stats
        </h3>
        <ul className="space-y-3">
          <StatItem label="Total Wins" value={profileData.quantumChessWins} />
          <StatItem
            label="Total Games Played"
            value={profileData.quantumChessTotalGames}
          />
          <StatItem label="Win Rate" value={winRate} />
          <StatItem
            label="Current Streak"
            value={`${profileData.quantumChessCurrentStreak} wins`}
          />
        </ul>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-6">
        <h3 className="text-xl font-bold mb-4 dark:text-white">Puzzle Stats</h3>
        <ul className="space-y-3">
          <StatItem label="Puzzles Solved" value={profileData.puzzlesSolved} />
          <StatItem
            label="Average Time"
            value={formatSecondsToTime(profileData.puzzleAverageTimeSeconds)}
          />
          <StatItem
            label="Perfect Solutions"
            value={profileData.puzzlePerfectSolutions}
          />
        </ul>
      </div>
    </div>
  );
};

export default GameStats;
