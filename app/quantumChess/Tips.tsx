import { AnimatePresence, motion } from "framer-motion";

interface TipsProps {
  text: string;
  show: boolean;
  setShowKnowledge: React.Dispatch<React.SetStateAction<boolean>>;
}

export function Tips({ text, show, setShowKnowledge }: TipsProps) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="
              absolute top-4 left-1/2 transform -translate-x-1/2 
              bg-black/70 text-white px-4 py-2 rounded-lg shadow-lg z-50
            "
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -50, opacity: 0 }}
          transition={{ type: "spring", stiffness: 120, damping: 20 }}
        >
          <div className="flex gap-2">
            {text}
            <p className="underscore" onClick={() => setShowKnowledge(true)}>
              Here
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
