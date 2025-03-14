"use client";
import { motion } from "framer-motion";
import {
  PuzzlePieceIcon,
  TrophyIcon,
  BookOpenIcon,
} from "@heroicons/react/24/outline";
import React from "react";
import ResourceCard from "@/components/home/ResourceCard";
import AchievementBadge from "@/components/home/AchievementBadge";
import GameCard from "@/components/home/GameCard";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-purple-50 dark:from-slate-900 dark:to-slate-800">
      <section className="container mx-auto px-6 py-20 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-5xl font-bold mb-6 dark:text-white">
            Quantum Playground:
            <br />
            <span className="bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
              Where Physics Meets Fun!
            </span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 dark:text-gray-300">
            Master quantum concepts through chess, puzzles, and challenges.
            Compete with friends and earn cool rewards!
          </p>
          <button className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-4 rounded-full text-lg font-semibold transition-all transform hover:scale-105">
            Start Playing Now!
          </button>
        </motion.div>
      </section>

      {/* Featured Games */}
      <section className="container mx-auto px-6 py-16">
        <h2 className="text-3xl font-bold text-center mb-12 dark:text-white">
          Featured Games
        </h2>
        <div className="grid md:grid-cols-2 gap-8">
          <GameCard
            title="Quantum Chess"
            icon={<PuzzlePieceIcon className="h-8 w-8" />}
            description="Make superposition moves and entangle pieces in this mind-bending chess variant"
            bgColor="bg-purple-100 dark:bg-purple-900"
          />
          <GameCard
            title="Particle Puzzle"
            icon={<PuzzlePieceIcon className="h-8 w-8" />}
            description="Solve quantum states puzzles to advance through particle worlds"
            bgColor="bg-indigo-100 dark:bg-indigo-900"
          />
        </div>
      </section>

      {/* Leaderboard Preview */}
      <section className="bg-white dark:bg-slate-800 py-20">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <h3 className="text-3xl font-bold mb-8 dark:text-white flex items-center gap-2">
              <TrophyIcon className="h-8 w-8 text-yellow-500" />
              Weekly Champions
            </h3>
            <div className="space-y-4">
              {["QuantumMaster22", "SuperpositionSara", "EntangledEthan"].map(
                (user, index) => (
                  <div
                    key={user}
                    className="flex items-center justify-between bg-indigo-50 dark:bg-slate-700 p-4 rounded-lg"
                  >
                    <div className="flex items-center gap-4">
                      <span className="text-lg font-bold text-purple-600 dark:text-purple-400">
                        #{index + 1}
                      </span>
                      <span className="dark:text-white">{user}</span>
                    </div>
                    <span className="text-gray-600 dark:text-gray-300">
                      {1500 - index * 200} XP
                    </span>
                  </div>
                )
              )}
            </div>
            <div className="mt-8 text-center">
              <a
                href="/leaderboard"
                className="text-purple-600 hover:text-purple-700 dark:text-purple-400 font-semibold"
              >
                See Full Leaderboard →
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Achievements Showcase */}
      <section className="container mx-auto px-6 py-20">
        <h3 className="text-3xl font-bold mb-12 dark:text-white flex items-center gap-2 justify-center">
          <span className="bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
            Collectible Achievements
          </span>
          🏆
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <AchievementBadge title="Quantum Novice" unlocked={true} icon="⚛️" />
          <AchievementBadge
            title="Superposition Pro"
            unlocked={false}
            icon="🌀"
          />
          <AchievementBadge
            title="Entanglement Master"
            unlocked={false}
            icon="🔗"
          />
          <AchievementBadge
            title="Quantum Grandmaster"
            unlocked={false}
            icon="🎖️"
          />
        </div>
      </section>

      {/* Learning Resources */}
      <section className="bg-indigo-50 dark:bg-slate-800 py-20">
        <div className="container mx-auto px-6">
          <h3 className="text-3xl font-bold mb-12 dark:text-white flex items-center gap-2">
            <BookOpenIcon className="h-8 w-8" />
            Game Guides & Learning
          </h3>
          <div className="grid md:grid-cols-3 gap-8">
            <ResourceCard
              title="Quantum Chess Rules"
              type="Video Guide"
              difficulty="Beginner"
            />
            <ResourceCard
              title="Understanding Superposition"
              type="Interactive Lesson"
              difficulty="Intermediate"
            />
            <ResourceCard
              title="Quantum Puzzle Solutions"
              type="Cheat Sheet"
              difficulty="Advanced"
            />
          </div>
        </div>
      </section>
    </div>
  );
}

// // Updated Components
// function GameNavbar() {
//   return (
//     <nav className="sticky top-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 z-50">
//       <div className="container mx-auto px-6 py-4 flex justify-between items-center">
//         <span className="text-xl font-bold text-purple-600 dark:text-purple-400">
//           QuantumPlay
//         </span>

//         <div className="flex items-center gap-6">
//           <nav className="hidden md:flex gap-6">
//             <a
//               href="/games"
//               className="hover:text-purple-600 dark:hover:text-purple-400"
//             >
//               Games
//             </a>
//             <a
//               href="/leaderboard"
//               className="hover:text-purple-600 dark:hover:text-purple-400"
//             >
//               Leaderboard
//             </a>
//             <a
//               href="/achievements"
//               className="hover:text-purple-600 dark:hover:text-purple-400"
//             >
//               Achievements
//             </a>
//             <a
//               href="/learn"
//               className="hover:text-purple-600 dark:hover:text-purple-400"
//             >
//               Learn
//             </a>
//           </nav>
//           <button className="bg-purple-600 text-white px-6 py-2 rounded-full">
//             Player Profile
//           </button>
//         </div>
//       </div>
//     </nav>
//   );
// }

// function GameCard({
//   title,
//   icon,
//   description,
//   bgColor,
// }: {
//   title: string;
//   icon: ReactNode;
//   description: string;
//   bgColor: string;
// }) {
//   return (
//     <motion.div
//       className={`${bgColor} p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow dark:bg-opacity-50`}
//       whileHover={{ scale: 1.02 }}
//     >
//       <div className="w-12 h-12 mb-4 flex items-center justify-center bg-white rounded-lg dark:bg-slate-700">
//         {icon}
//       </div>
//       <h4 className="text-xl font-semibold mb-2 dark:text-white">{title}</h4>
//       <p className="text-gray-600 dark:text-gray-400">{description}</p>
//       <button className="mt-6 bg-purple-600 text-white px-6 py-2 rounded-full">
//         Play Now
//       </button>
//     </motion.div>
//   );
// }

// function AchievementBadge({
//   title,
//   unlocked,
//   icon,
// }: {
//   title: string;
//   unlocked: boolean;
//   icon: string;
// }) {
//   return (
//     <div
//       className={`p-4 text-center rounded-xl ${
//         unlocked
//           ? "bg-green-100 dark:bg-green-900"
//           : "bg-gray-100 dark:bg-slate-700 opacity-50"
//       }`}
//     >
//       <div className="text-4xl mb-2">{icon}</div>
//       <h5
//         className={`font-medium ${
//           unlocked
//             ? "text-green-700 dark:text-green-300"
//             : "text-gray-500 dark:text-gray-400"
//         }`}
//       >
//         {title}
//       </h5>
//       <div className="text-sm mt-1">{unlocked ? "Unlocked!" : "Locked"}</div>
//     </div>
//   );
// }

// function ResourceCard({
//   title,
//   type,
//   difficulty,
// }: {
//   title: string;
//   type: string;
//   difficulty: string;
// }) {
//   return (
//     <div className="bg-white dark:bg-slate-700 p-6 rounded-xl hover:shadow-lg transition-shadow">
//       <div className="flex justify-between items-start mb-4">
//         <span className="text-sm text-purple-600 dark:text-purple-400">
//           {type}
//         </span>
//         <span className="px-2 py-1 text-xs bg-purple-100 dark:bg-purple-900 rounded-full">
//           {difficulty}
//         </span>
//       </div>
//       <h4 className="text-lg font-semibold mb-2 dark:text-white">{title}</h4>
//       <button className="text-purple-600 dark:text-purple-400 hover:underline">
//         View Resource →
//       </button>
//     </div>
//   );
// }
