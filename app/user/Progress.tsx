import React from "react";
import { initialProfileData } from "./initialProfileData";
import ProgressBar from "@/components/ProgressBar";
import { GameProfile } from "@prisma/client";

const Progress = ({ gameProfile }: { gameProfile: GameProfile | null }) => {
  const profileData = gameProfile ?? initialProfileData;
  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-8 mb-8">
      <h2 className="text-2xl font-bold mb-6 dark:text-white">
        Quantum Mastery Progress
      </h2>
      <div className="space-y-4">
        <ProgressBar
          label="Quantum Chess Skills"
          progress={profileData.quantumChessSkillsProgress}
          color="bg-purple-600"
        />
        <ProgressBar
          label="Puzzle Solving"
          progress={profileData.puzzleSolvingProgress}
          color="bg-indigo-600"
        />
        <ProgressBar
          label="Learning Progress"
          progress={profileData.learningProgress}
          color="bg-blue-600"
        />
      </div>
    </div>
  );
};

export default Progress;
