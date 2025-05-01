import { AnimatePresence, motion } from "framer-motion";

type RewardModalProps = {
  isOpen: boolean;
  onClose(): void;
  rewardAmount: number;
};

export default function RewardModal({
  isOpen,
  onClose,
  rewardAmount,
}: RewardModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-white rounded-2xl p-6 shadow-xl max-w-sm w-full text-center"
            initial={{ y: -50, opacity: 0, scale: 0.8 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: -50, opacity: 0, scale: 0.8 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            <h2 className="text-2xl font-bold mb-4 text-gray-900">
              🎉 Daily Reward! 🎉
            </h2>
            <p className="mb-6 text-gray-800">
              You’ve earned{" "}
              <span className="font-semibold text-green-500">
                {rewardAmount}
              </span>{" "}
              tokens.
            </p>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Awesome!
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
