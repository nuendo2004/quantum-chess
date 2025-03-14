// app/profile/page.tsx

"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import {
  PencilIcon,
  ShieldCheckIcon,
  TrophyIcon,
  PuzzlePieceIcon,
} from "@heroicons/react/24/outline";
import GameFooter from "../../components/Footer";
import { useSession } from "next-auth/react";
import Image from "next/image";

interface User {
  id: string;
  name: string;
  email: string;
  image?: string;
  dateCreated: string;
}

export default function ProfilePage() {
  const { data: session } = useSession();
  const [user, setUser] = useState<User | null>(null);

  const [editMode, setEditMode] = useState(false);
  const [tempName, setTempName] = useState(user?.name);

  useEffect(() => {
    if (session?.user)
      setUser({
        id: session.user.id,
        name: session.user.name || "Unknown",
        email: session.user.email || "No email set",
        //@ts-expect-error type invalid
        dateCreated: session.user.dateCreated || "unknown",
        image: session.user.image,
      });
  }, [session]);

  // Mock game stats
  const gameStats = {
    quantumChessWins: 12,
    puzzlesSolved: 45,
    achievementsUnlocked: 8,
    currentRank: "Quantum Novice",
    xp: 2450,
  };

  const handleSaveProfile = () => {
    // to do (user - put)
  };

  return (
    user && (
      <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-purple-50 dark:from-slate-900 dark:to-slate-800">
        <main className="container mx-auto px-6 py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-8 mb-8"
          >
            <div className="flex flex-col md:flex-row items-start gap-8">
              <div className="relative group">
                <Image
                  src={
                    user.image ||
                    "https://e7.pngegg.com/pngimages/177/551/png-clipart-user-interface-design-computer-icons-default-stephen-salazar-graphy-user-interface-design-computer-wallpaper-thumbnail.png"
                  }
                  className="w-32 h-32 rounded-full border-4 border-purple-200 dark:border-purple-900"
                  alt="User avatar"
                  width={50}
                  height={50}
                />
                <button className="absolute bottom-0 right-0 bg-purple-600 p-2 rounded-full hover:bg-purple-700 transition-colors">
                  <PencilIcon className="h-5 w-5 text-white" />
                </button>
              </div>

              <div className="flex-1">
                <div className="flex items-center gap-4 mb-4">
                  {editMode ? (
                    <input
                      type="text"
                      value={tempName}
                      onChange={(e) => setTempName(e.target.value)}
                      className="text-3xl font-bold bg-transparent border-b-2 border-purple-600 dark:text-white"
                    />
                  ) : (
                    <h1 className="text-3xl font-bold dark:text-white">
                      {user.name}
                    </h1>
                  )}
                  <button
                    onClick={
                      editMode ? handleSaveProfile : () => setEditMode(true)
                    }
                    className="text-purple-600 hover:text-purple-700 dark:text-purple-400"
                  >
                    {editMode ? "Save Changes" : "Edit Profile"}
                  </button>
                </div>

                <div className="space-y-2 text-gray-600 dark:text-gray-300">
                  <div className="flex items-center gap-2">
                    <ShieldCheckIcon className="h-5 w-5" />
                    <span>{user.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <TrophyIcon className="h-5 w-5" />
                    <span>
                      Member since{" "}
                      {new Date(user.dateCreated).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Stats Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <StatCard
              icon={<TrophyIcon className="h-8 w-8" />}
              title="Current Rank"
              value={gameStats.currentRank}
              color="bg-purple-100 dark:bg-purple-900"
            />
            <StatCard
              icon={<PuzzlePieceIcon className="h-8 w-8" />}
              title="XP Points"
              value={gameStats.xp.toString()}
              color="bg-indigo-100 dark:bg-indigo-900"
            />
            <StatCard
              icon={<ShieldCheckIcon className="h-8 w-8" />}
              title="Achievements"
              value={`${gameStats.achievementsUnlocked}/50`}
              color="bg-blue-100 dark:bg-blue-900"
            />
          </div>

          {/* Progress Section */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-8">
            <h2 className="text-2xl font-bold mb-6 dark:text-white">
              Quantum Mastery Progress
            </h2>
            <div className="space-y-4">
              <ProgressBar
                label="Quantum Chess Skills"
                progress={65}
                color="bg-purple-600"
              />
              <ProgressBar
                label="Puzzle Solving"
                progress={40}
                color="bg-indigo-600"
              />
              <ProgressBar
                label="Learning Progress"
                progress={85}
                color="bg-blue-600"
              />
            </div>
          </div>

          {/* Game Specific Stats */}
          <div className="grid md:grid-cols-2 gap-6 mt-8">
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-6">
              <h3 className="text-xl font-bold mb-4 dark:text-white">
                Quantum Chess Stats
              </h3>
              <ul className="space-y-3">
                <StatItem
                  label="Total Wins"
                  value={gameStats.quantumChessWins}
                />
                <StatItem label="Win Rate" value="62%" />
                <StatItem label="Current Streak" value="3 wins" />
              </ul>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-6">
              <h3 className="text-xl font-bold mb-4 dark:text-white">
                Puzzle Stats
              </h3>
              <ul className="space-y-3">
                <StatItem
                  label="Puzzles Solved"
                  value={gameStats.puzzlesSolved}
                />
                <StatItem label="Average Time" value="2m 15s" />
                <StatItem label="Perfect Solutions" value="27" />
              </ul>
            </div>
          </div>
        </main>

        <GameFooter />
      </div>
    )
  );
}

// Components
function StatCard({ icon, title, value, color }) {
  return (
    <motion.div
      className={`${color} p-6 rounded-xl flex items-center gap-4`}
      whileHover={{ scale: 1.02 }}
    >
      <div className="p-3 bg-white dark:bg-slate-700 rounded-lg">{icon}</div>
      <div>
        <h3 className="text-gray-600 dark:text-gray-300 text-sm">{title}</h3>
        <p className="text-2xl font-bold dark:text-white">{value}</p>
      </div>
    </motion.div>
  );
}

function ProgressBar({ label, progress, color }) {
  return (
    <div>
      <div className="flex justify-between mb-2">
        <span className="dark:text-gray-300">{label}</span>
        <span className="dark:text-gray-300">{progress}%</span>
      </div>
      <div className="h-3 bg-gray-200 dark:bg-slate-700 rounded-full overflow-hidden">
        <div
          className={`h-full ${color} transition-all duration-500`}
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}

function StatItem({ label, value }) {
  return (
    <li className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-slate-700">
      <span className="text-gray-600 dark:text-gray-300">{label}</span>
      <span className="font-medium dark:text-white">{value}</span>
    </li>
  );
}
