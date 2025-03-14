"use client";
import React from "react";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

const Navbar: React.FC = () => {
  const { data: session } = useSession();
  const router = useRouter();

  const handleLogout = () => {
    signOut();
  };

  return (
    <nav className="sticky top-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 z-50">
      <div className="container mx-auto px-3 py-4 flex justify-between items-center">
        <span
          onClick={() => router.replace("/")}
          className="text-xl font-bold text-purple-600 dark:text-purple-400 cursor-pointer"
        >
          QuantumPlay
        </span>

        <div className="flex items-center gap-6">
          <nav className="hidden md:flex gap-6">
            <a
              href="/games"
              className="hover:text-purple-600 dark:hover:text-purple-400"
            >
              Games
            </a>
            <a
              href="/leaderboard"
              className="hover:text-purple-600 dark:hover:text-purple-400"
            >
              Leaderboard
            </a>
            <a
              href="/achievements"
              className="hover:text-purple-600 dark:hover:text-purple-400"
            >
              Achievements
            </a>
            <a
              href="/learn"
              className="hover:text-purple-600 dark:hover:text-purple-400"
            >
              Learn
            </a>
          </nav>
          <div className="flex items-center gap-4">
            {session ? (
              <div className="flex items-center gap-4">
                <span className="sm:inline">
                  Welcome, {session.user.name?.split(" ")[0]}
                </span>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md transition-colors duration-200"
                >
                  Logout
                </button>
              </div>
            ) : (
              <button
                onClick={() => router.push("/signin")}
                className="bg-purple-600 text-white px-6 py-2 rounded-full"
              >
                Login
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
