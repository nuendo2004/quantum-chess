"use client";
import React from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import ProfileMenu from "./ProfileMenu";

const Navbar: React.FC = () => {
  const { data: session } = useSession();
  const router = useRouter();

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
          <nav className="hidden md:flex gap-6 text-purple-200">
            <a
              href="/quantumChess"
              className="hover:text-purple-600 dark:hover:text-purple-400"
            >
              Games
            </a>
            <a
              href="/ranking"
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
              href="/blogs"
              className="hover:text-purple-600 dark:hover:text-purple-400"
            >
              Learn
            </a>
          </nav>
          <div className="flex items-center gap-4">
            {session ? (
              <div className="flex items-center gap-4">
                <span className="sm:inline">
                  {session.user.name?.split(" ")[0]}
                </span>
                <ProfileMenu />
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
