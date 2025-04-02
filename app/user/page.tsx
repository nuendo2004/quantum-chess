"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import {
  PencilIcon,
  ShieldCheckIcon,
  TrophyIcon,
} from "@heroicons/react/24/outline";
import GameFooter from "../../components/Footer";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Progress from "./Progress";
import GameStats from "./GameStats";
import Achievement from "./Achievement";
import { User, GameProfile } from "@prisma/client";

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const [user, setUser] = useState<User | null>(null);
  const [gameProfile, setGameProfile] = useState<GameProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [editMode, setEditMode] = useState(false);
  const [tempName, setTempName] = useState("");

  useEffect(() => {
    if (status === "authenticated" && session?.user) {
      setIsLoading(true);
      setError(null);

      fetch("/api/user")
        .then(async (res) => {
          if (!res.ok) {
            const errorData = await res.json().catch(() => ({}));
            throw new Error(
              errorData.message || `HTTP error! status: ${res.status}`
            );
          }
          return res.json();
        })
        .then((data) => {
          if (!data.user) {
            throw new Error("User data not found in response.");
          }
          setUser(data.user);
          setGameProfile(data.gameProfile);
          setTempName(data.user.name || "");
        })
        .catch((err) => {
          console.error("Failed to fetch profile data:", err);
          setError(err.message || "Failed to load profile data.");
          setUser(null);
          setGameProfile(null);
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else if (status === "unauthenticated") {
      setIsLoading(false);
      setError("Please log in to view your profile.");
    }
  }, [status, session?.user]);

  const handleSaveProfile = async () => {
    if (!user || tempName === user.name) {
      setEditMode(false);
      return;
    }

    try {
      const response = await fetch("/api/profile/update-name", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: tempName }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message ||
            `Failed to update profile. Status: ${response.status}`
        );
      }

      const updatedUser = await response.json();
      setUser(updatedUser);
      setEditMode(false);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      console.error("Failed to save profile:", err);
      setError(err.message || "Could not save profile changes.");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gradient-to-b from-indigo-50 to-purple-50 dark:from-slate-900 dark:to-slate-800">
        <p className="text-xl dark:text-white">Loading Profile...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gradient-to-b from-indigo-50 to-purple-50 dark:from-slate-900 dark:to-slate-800">
        <p className="text-xl text-red-600 dark:text-red-400">Error: {error}</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gradient-to-b from-indigo-50 to-purple-50 dark:from-slate-900 dark:to-slate-800">
        <p className="text-xl dark:text-white">Could not load user profile.</p>
      </div>
    );
  }

  return (
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
                src={user.image || "/default-avatar.png"}
                className="w-32 h-32 rounded-full border-4 border-purple-200 dark:border-purple-900 object-cover"
                alt="User avatar"
                width={128}
                height={128}
                onError={(e) => {
                  e.currentTarget.src = "/default-avatar.png";
                }}
              />

              <button
                title="Change Avatar (Not Implemented)"
                className="absolute bottom-0 right-0 bg-purple-600 p-2 rounded-full hover:bg-purple-700 transition-colors cursor-not-allowed opacity-50"
              >
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
                    className="text-3xl font-bold bg-transparent border-b-2 border-purple-600 dark:text-white dark:border-purple-400 focus:outline-none focus:ring-0"
                    aria-label="Edit user name"
                  />
                ) : (
                  <h1 className="text-3xl font-bold dark:text-white">
                    {user.name || "Unnamed User"}
                  </h1>
                )}
                <button
                  onClick={
                    editMode
                      ? handleSaveProfile
                      : () => {
                          setEditMode(true);
                          setTempName(user.name || "");
                        }
                  }
                  className="text-purple-600 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300 text-sm font-medium whitespace-nowrap"
                  disabled={editMode && tempName === user.name}
                >
                  {editMode ? "Save Changes" : "Edit Name"}
                </button>
                {editMode && (
                  <button
                    onClick={() => {
                      setEditMode(false);
                      setTempName(user.name || "");
                    }} // Cancel button
                    className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 text-sm font-medium ml-2"
                  >
                    Cancel
                  </button>
                )}
              </div>

              <div className="space-y-2 text-gray-600 dark:text-gray-300">
                <div className="flex items-center gap-2">
                  <ShieldCheckIcon className="h-5 w-5 flex-shrink-0" />
                  <span>{user.email || "No email set"}</span>
                </div>
                <div className="flex items-center gap-2">
                  <TrophyIcon className="h-5 w-5 flex-shrink-0" />
                  <span>
                    Member since{" "}
                    {user.dateCreated !== "unknown"
                      ? new Date(user.dateCreated).toLocaleDateString()
                      : "Unknown"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        <Achievement gameProfile={gameProfile} />

        <Progress gameProfile={gameProfile} />

        <GameStats gameProfile={gameProfile} />
      </main>

      <GameFooter />
    </div>
  );
}
