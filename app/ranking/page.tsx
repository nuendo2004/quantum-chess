"use client";

import React, { useState, useEffect, useMemo } from "react";
import { FaMedal, FaUserCircle } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

interface LeaderboardEntry {
  rank: number;
  xp: number;
  user: {
    id: string;
    name: string | null;
    image: string | null;
  };
  currentRank?: string;
}

interface ApiResponse {
  entries: LeaderboardEntry[];
  totalCount: number;
}

const PAGE_SIZE = 15;

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: "easeOut",
    },
  },
};

const statusVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  transition: { duration: 0.3 },
};

const LeaderboardPage: React.FC = () => {
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardEntry[]>(
    []
  );
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalCount, setTotalCount] = useState<number>(0);

  const totalPages = useMemo(
    () => Math.ceil(totalCount / PAGE_SIZE),
    [totalCount]
  );

  useEffect(() => {
    setIsLoading(true);
    const fetchLeaderboard = async () => {
      setError(null);
      try {
        const response = await fetch(
          `/api/leaderboard?page=${currentPage}&pageSize=${PAGE_SIZE}`
        );
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data: ApiResponse = await response.json();
        setLeaderboardData(data.entries);
        setTotalCount(data.totalCount);
      } catch (err) {
        console.error("Failed to fetch leaderboard:", err);
        setError(
          err instanceof Error ? err.message : "An unknown error occurred."
        );
        setLeaderboardData([]);
        setTotalCount(0);
      } finally {
        setTimeout(() => setIsLoading(false), 200);
      }
    };

    fetchLeaderboard();
  }, [currentPage]);

  const getRankColor = (rank: number): string => {
    if (rank === 1) return "text-amber-500 dark:text-amber-400";
    if (rank === 2) return "text-slate-500 dark:text-slate-400";
    if (rank === 3) return "text-orange-700 dark:text-orange-500";
    return "text-gray-600 dark:text-gray-400";
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages && !isLoading) {
      setCurrentPage(newPage);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 min-h-screen bg-gray-50 dark:bg-gray-900">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-3xl font-bold text-center mb-8 text-purple-700 dark:text-purple-300"
      >
        Global XP Leaderboard
      </motion.h1>

      <AnimatePresence mode="wait">
        {" "}
        {isLoading && (
          <motion.div
            key="loading"
            variants={statusVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="text-center py-10 text-indigo-600 dark:text-indigo-400"
          >
            <svg
              className="animate-spin h-8 w-8 text-indigo-500 mx-auto"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            <p className="mt-2">Loading Rankings...</p>
          </motion.div>
        )}
        {error && !isLoading && (
          <motion.div
            key="error"
            variants={statusVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="text-center py-10 text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/50 p-4 rounded-lg"
          >
            <p>Failed to load leaderboard: {error}</p>
            <button
              onClick={() => handlePageChange(currentPage)}
              className="mt-4 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded transition-colors duration-200"
            >
              Retry
            </button>
          </motion.div>
        )}
        {!isLoading && !error && leaderboardData.length === 0 && (
          <motion.div
            key="empty"
            variants={statusVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="text-center py-10 text-gray-500 dark:text-gray-400"
          >
            <p>The leaderboard is currently empty.</p>
          </motion.div>
        )}
        {!isLoading && !error && leaderboardData.length > 0 && (
          <motion.div key="data">
            {" "}
            {/* Key for the data view */}
            <div className="overflow-x-auto shadow-md rounded-lg bg-white dark:bg-gray-800">
              <table className="w-full text-sm text-left text-gray-700 dark:text-gray-300">
                <thead className="text-xs text-purple-800 uppercase bg-purple-100 dark:bg-purple-900/50 dark:text-purple-200">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-center w-16">
                      Rank
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Player
                    </th>
                    <th scope="col" className="px-6 py-3 text-right">
                      XP
                    </th>
                  </tr>
                </thead>
                <motion.tbody
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                >
                  {leaderboardData.map((entry) => (
                    <motion.tr
                      key={entry.user.id}
                      variants={itemVariants}
                      className="border-b dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors duration-200" // Keep hover effect
                    >
                      <td
                        className={`px-6 py-4 text-center font-semibold ${getRankColor(
                          entry.rank
                        )}`}
                      >
                        {entry.rank <= 3 && (
                          <FaMedal className="inline mr-1 mb-0.5" />
                        )}
                        {entry.rank}
                      </td>
                      <td className="px-6 py-4 font-medium text-gray-900 dark:text-white whitespace-nowrap">
                        <div className="flex items-center">
                          {entry.user.image ? (
                            <Image
                              src={entry.user.image}
                              alt={entry.user.name || "Player Avatar"}
                              width={40}
                              height={40}
                              className="rounded-full object-cover mr-3 border border-gray-300 dark:border-gray-600"
                            />
                          ) : (
                            <FaUserCircle className="h-10 w-10 text-gray-400 dark:text-gray-500 mr-3" />
                          )}
                          <span>{entry.user.name || "Anonymous User"}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right font-semibold text-indigo-600 dark:text-indigo-300">
                        {entry.xp.toLocaleString()}
                      </td>
                    </motion.tr>
                  ))}
                </motion.tbody>
              </table>
            </div>
            {totalPages > 1 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="flex justify-center items-center space-x-2 mt-6"
              >
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1 || isLoading}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-100 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                >
                  Previous
                </button>
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages || isLoading}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-100 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                >
                  Next
                </button>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LeaderboardPage;
