import React from "react";
import StatCard from "./StatCard";
import {
  PuzzlePieceIcon,
  ShieldCheckIcon,
  TrophyIcon,
} from "@heroicons/react/24/outline";
import { GameProfile } from "@prisma/client";
import { initialProfileData } from "./page";

const Achievement = ({ gameProfile }: { gameProfile: GameProfile | null }) => {
  const profileData = gameProfile ?? initialProfileData;

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
      <StatCard
        icon={
          <TrophyIcon className="h-8 w-8 text-purple-700 dark:text-purple-300" />
        }
        title="Current Rank"
        value={profileData.currentRank}
        color="bg-purple-100 dark:bg-purple-900/50"
      />
      <StatCard
        icon={
          <PuzzlePieceIcon className="h-8 w-8 text-indigo-700 dark:text-indigo-300" />
        }
        title="XP Points"
        value={profileData.xp.toString()}
        color="bg-indigo-100 dark:bg-indigo-900/50"
      />
      <StatCard
        icon={
          <ShieldCheckIcon className="h-8 w-8 text-blue-700 dark:text-blue-300" />
        }
        title="Achievements"
        // Assuming 50 is the total possible achievements
        value={`${profileData.achievementsUnlocked}/50`}
        color="bg-blue-100 dark:bg-blue-900/50"
      />
    </div>
  );
};

export default Achievement;
