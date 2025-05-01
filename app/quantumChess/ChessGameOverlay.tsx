import useGameStore from "@/store/gamesStore";
import { motion, AnimatePresence } from "framer-motion";
import CountUp from "react-countup";
import { FaPlus } from "react-icons/fa";

export default function ChessGameOverlay() {
  const {
    gameOver,
    setGameOver,
    winner,
    playerColor,
    playerXP,
    gameScore,
    restartGame,
  } = useGameStore((state) => state);
  return (
    <AnimatePresence>
      {gameOver === 1 && (
        <motion.div
          className="pointer-events-none absolute inset-0 flex items-center justify-center backdrop-blur-md bg-black/50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <motion.div
            className="pointer-events-auto flex flex-col items-center gap-6"
            initial={{ scale: 0.8, y: -50, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            <motion.h1
              className="text-4xl font-bold text-white drop-shadow-lg"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{
                type: "spring",
                stiffness: 400,
                damping: 20,
                delay: 0.4,
              }}
            >
              {winner === playerColor ? "You Won" : "You Lost"}
            </motion.h1>

            <motion.div
              className="flex items-center gap-2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                delay: 0.6,
                type: "spring",
                stiffness: 200,
                damping: 20,
              }}
            >
              <FaPlus className="h-6 w-6 text-white drop-shadow-lg" />
              <CountUp
                end={playerXP + gameScore}
                duration={1.5}
                className="text-4xl font-bold text-white drop-shadow-lg"
              />
            </motion.div>

            <motion.button
              onClick={() => {
                restartGame();
                setGameOver(0);
              }}
              className="rounded-2xl bg-purple-600 px-8 py-3 text-lg font-semibold text-white shadow-xl hover:bg-purple-700 transition-transform"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{
                delay: 0.8,
                type: "spring",
                stiffness: 300,
                damping: 20,
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Restart Game
            </motion.button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
