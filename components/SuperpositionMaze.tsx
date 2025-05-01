"use client";

import { useState } from "react";
import { motion } from "framer-motion";

const maze = [
  ["S", "", "X", ""],
  ["X", "", "X", ""],
  ["", "", "", "X"],
  ["", "X", "", "E"],
];

const isSuperposed = (x: number, y: number) => x === 0 && y === 1;

export default function SuperpositionMaze() {
  const [position, setPosition] = useState([0, 0]);
  const [superposition, setSuperposition] = useState(false);

  const move = (dx: number, dy: number) => {
    const [x, y] = position;
    const [nx, ny] = [x + dx, y + dy];
    if (nx < 0 || ny < 0 || nx >= 4 || ny >= 4) return;
    if (maze[nx][ny] === "X") return;
    if (isSuperposed(nx, ny)) {
      setSuperposition(true);
    } else {
      setSuperposition(false);
    }
    setPosition([nx, ny]);
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Superposition Maze Game</h1>
      <div className="grid grid-cols-4 gap-2">
        {maze.map((row, i) =>
          row.map((cell, j) => {
            const isPlayer = position[0] === i && position[1] === j;
            return (
              <motion.div
                key={`${i}-${j}`}
                className={`w-16 h-16 flex items-center justify-center border rounded-lg text-white text-sm
                  ${cell === "X" ? "bg-gray-700" : "bg-purple-500"}
                  ${isPlayer ? "ring-4 ring-yellow-300" : ""}`}
                animate={{ opacity: superposition && isPlayer ? 0.5 : 1 }}
                transition={{ duration: 0.3 }}
              >
                {cell === "S"
                  ? "Start"
                  : cell === "E"
                  ? "End"
                  : cell === "X"
                  ? ""
                  : ""}
              </motion.div>
            );
          })
        )}
      </div>
      <div className="mt-4 flex gap-4 flex-wrap">
        <button onClick={() => move(-1, 0)} className="px-4 py-2 bg-blue-500 text-white rounded">Up</button>
        <button onClick={() => move(1, 0)} className="px-4 py-2 bg-blue-500 text-white rounded">Down</button>
        <button onClick={() => move(0, -1)} className="px-4 py-2 bg-blue-500 text-white rounded">Left</button>
        <button onClick={() => move(0, 1)} className="px-4 py-2 bg-blue-500 text-white rounded">Right</button>
      </div>
      {superposition && <p className="mt-2 text-yellow-400">⚛️ You're in superposition!</p>}
    </div>
  );
}
