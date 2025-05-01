// ✅ File: components/SuperpositionMaze.tsx
"use client";

import { useState } from "react";
import { motion } from "framer-motion";

const levels = [
  [
    ["S", "", "", "Z", "X"],
    ["X", "X", "H", "Z", "X"],
    ["", "", "X", "Z", "X"],
    ["", "X", "X", "", "X"],
    ["", "X", "", "", "E"]
  ],
  [
    ["S", "", "H", "Z", "X"],
    ["X", "", "", "T", "X"],
    ["", "H", "X", "Z", ""],
    ["", "Z", "", "X", ""],
    ["", "T", "Z", "", "E"]
  ],
  [
    ["S", "", "Z", "H", "X"],
    ["X", "", "", "T", "X"],
    ["", "H", "X", "Z", ""],
    ["T", "X", "Z", "", ""],
    ["", "T", "", "H", "E"]
  ]
];

const levelGoals = [
  "Reach 🏁 with superposition |ψ⟩ = (|0⟡ + |1⟡)/√2",
  "Teleport and reach 🏁 with state |1⟡ after phase flip",
  "Navigate Hadamard and Z gates to reach 🏁 in a stable quantum state"
];

const isEnd = (maze: string[][], x: number, y: number) => maze[x][y] === "E";

export default function SuperpositionMaze() {
  const [level, setLevel] = useState(0);
  const [maze, setMaze] = useState(levels[0]);
  const [position, setPosition] = useState([0, 0]);
  const [superposition, setSuperposition] = useState(false);
  const [visitedH, setVisitedH] = useState(false);
  const [visitedZ, setVisitedZ] = useState(false);
  const [message, setMessage] = useState("");
  const [qubitState, setQubitState] = useState("|0⟡");
  const [qubitLog, setQubitLog] = useState<string[]>(["Start at |0⟡"]);
  const [gateInfo, setGateInfo] = useState("Navigate to reach 🏁 by activating required quantum gates.");

  const logQubitChange = (desc: string, state: string) => {
    setQubitLog((prev) => [...prev, `${desc}: ${state}`]);
  };

  const move = (dx: number, dy: number) => {
    const [x, y] = position;
    const [nx, ny] = [x + dx, y + dy];
    if (nx < 0 || ny < 0 || nx >= maze.length || ny >= maze[0].length) return;
    const cell = maze[nx][ny];
    if (cell === "X") {
      setMessage("🚫 Path blocked! Try another route.");
      return;
    }

    let newState = qubitState;

    if (cell === "H") {
      setSuperposition(true);
      setVisitedH(true);
      newState = "(|0⟡ + |1⟡)/√2";
      setQubitState(newState);
      logQubitChange("Hadamard Gate Applied", newState);
      setGateInfo("Hadamard Gate (H): Creates superposition |ψ⟩ = (|0⟩ + |1⟩)/√2");
      setMessage("🌀 Hadamard gate activated.");
    } else if (cell === "Z") {
      if (superposition) {
        setVisitedZ(true);
        newState = qubitState === "(|0⟡ + |1⟡)/√2" ? "(|0⟡ - |1⟡)/√2" : qubitState;
        setQubitState(newState);
        logQubitChange("Z Gate Applied", newState);
        setGateInfo("Z Gate (Z): Applies a phase flip to |1⟩ component.");
        setMessage("⚛️ Z gate applied (phase flip).");
      } else {
        setMessage("🚫 You need superposition before Z gate.");
        return;
      }
    } else if (cell === "T") {
      if (superposition) {
        setPosition([maze.length - 1, maze[0].length - 1]);
        newState = "|1⟡";
        setQubitState(newState);
        logQubitChange("Teleported", newState);
        setGateInfo("Teleport Gate (T): Only works with superposition.");
        setMessage("⚡ Quantum tunnel successful!");
        return;
      } else {
        setMessage("🚫 You need superposition first.");
        return;
      }
    } else {
      setMessage("");
    }

    setPosition([nx, ny]);

    if (isEnd(maze, nx, ny)) {
      if (!visitedH || !visitedZ) {
        setMessage("🔒 You must visit required gates (H, Z) before finishing.");
        return;
      }
      setMessage("🎉 Level Complete!");
      setTimeout(() => {
        if (level + 1 < levels.length) {
          setLevel(level + 1);
          setMaze(levels[level + 1]);
          setPosition([0, 0]);
          setSuperposition(false);
          setVisitedH(false);
          setVisitedZ(false);
          setQubitState("|0⟡");
          setQubitLog(["Start at |0⟡"]);
          setMessage("");
          setGateInfo("Navigate to reach 🏁 by activating required quantum gates.");
        } else {
          setMessage("🏁 All levels complete!");
        }
      }, 1000);
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto text-white bg-gradient-to-br from-indigo-900 to-purple-900 rounded-xl border border-purple-700 shadow-2xl">
      <h2 className="text-3xl font-extrabold text-purple-300 text-center mb-4 drop-shadow">
        🧩 Particle Puzzle Maze
      </h2>
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="lg:w-2/3">
          <div className="grid gap-2 w-fit mx-auto mb-6 rounded-md overflow-hidden"
            style={{ gridTemplateColumns: `repeat(${maze[0].length}, 3rem)` }}>
            {maze.map((row, i) =>
              row.map((cell, j) => {
                const isPlayer = position[0] === i && position[1] === j;
                return (
                  <motion.div key={`${i}-${j}`}
                    className={`w-12 h-12 flex items-center justify-center text-sm font-bold border border-slate-700 rounded-lg
                      ${cell === "X" ? "bg-gray-700" : "bg-gradient-to-br from-purple-700 to-indigo-700 text-white"}
                      ${isPlayer ? "ring-2 ring-yellow-400" : ""}`}
                    animate={{ scale: isPlayer ? 1.2 : 1 }}>
                    {isPlayer ? "🧍" : cell === "H" ? "H" : cell === "T" ? "T" : cell === "Z" ? "Z" : cell === "E" ? "🏁" : ""}
                  </motion.div>
                );
              })
            )}
          </div>
          <div className="flex justify-center gap-4 flex-wrap mb-4">
            <button onClick={() => move(-1, 0)} className="btn">⬆ Up</button>
            <button onClick={() => move(1, 0)} className="btn">⬇ Down</button>
            <button onClick={() => move(0, -1)} className="btn">⬅ Left</button>
            <button onClick={() => move(0, 1)} className="btn">➡ Right</button>
          </div>
          {message && <div className="text-center text-yellow-400 font-semibold mb-4 animate-pulse">{message}</div>}
        </div>

        <div className="lg:w-1/3 bg-slate-900 p-4 rounded-xl border border-purple-700 text-sm">
          <h3 className="text-lg font-bold text-purple-300 mb-2">Quantum Info</h3>

          <div className="mb-4">
            <p className="text-yellow-300 font-semibold">🎯 Goal State:</p>
            <p className="font-mono text-green-400">{levelGoals[level]}</p>
          </div>

          <div className="mb-4">
            <p className="text-yellow-300 font-semibold">🧠 Gate Info:</p>
            <p className="text-gray-300">{gateInfo}</p>
          </div>

          <div className="mb-4">
            <p className="text-yellow-300 font-semibold">🔬 Current Qubit State:</p>
            <p className="font-mono text-blue-300">{qubitState}</p>
          </div>

          <div>
            <p className="text-yellow-300 font-semibold mb-1">📜 Qubit Log:</p>
            <ul className="bg-slate-800 p-2 rounded-md max-h-40 overflow-y-auto text-gray-300">
              {qubitLog.map((log, idx) => <li key={idx}>• {log}</li>)}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
