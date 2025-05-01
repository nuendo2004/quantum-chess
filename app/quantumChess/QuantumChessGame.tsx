"use client";

import React, { useState } from "react";
import { Canvas, useThree, useFrame } from "@react-three/fiber";
import { Environment, OrbitControls, Loader, useGLTF } from "@react-three/drei";
import { Suspense, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import * as THREE from "three";
import ChessBoard from "./ChessBoard";
import PiecesGroup from "./PiecesGroup";
import GamePlay from "./GamePlay";
import useGameStore from "@/store/gamesStore";
import ChessGameOverlay from "./ChessGameOverlay";
import { useEffect } from "react";
import { Tips } from "./Tips";
import { FaTimes } from "react-icons/fa";
import { useUserStore } from "@/store/user";
import GeneralKnowledge from "./Knowledge/GeneralKnowledge";

useGLTF.preload("/model/chess_set_new.glb");

function ResetCameraOnStart({
  initialPosition = new THREE.Vector3(0, 7, -4),
}: {
  initialPosition?: THREE.Vector3;
}) {
  const { camera } = useThree();
  useEffect(() => {
    // snap the camera back to the “start” coords
    camera.position.copy(initialPosition);
    camera.lookAt(0, 0, 0);
  }, [camera, initialPosition]);
  return null;
}

function IntroCameraRig() {
  const { camera } = useThree();
  const start = useRef(Date.now());

  useFrame(() => {
    const t = (Date.now() - start.current) / 1000;
    const radius = 10;
    const height = 6;
    camera.position.set(
      Math.sin(t * 0.18) * radius,
      height,
      Math.cos(t * 0.18) * radius
    );
    camera.lookAt(0, 0, 0);
  });

  return null;
}

function TransitionCameraRig({ target = new THREE.Vector3(0, 7, -4) }) {
  const { camera } = useThree();

  useFrame((_, delta) => {
    const lerpSpeed = 0.005;
    camera.position.lerp(target, 1 - Math.pow(lerpSpeed, delta * 60));
    camera.lookAt(0, 0, 0);
  });

  return null;
}

export default function QuantumChessGame() {
  const { nodes } = useGLTF("/model/chess_set_new.glb");
  const { message, gameOver, setGameOver, winner, playerXP, playerColor } =
    useGameStore((state) => state);
  const {
    updateRankAndXp,
    gameProfile,
    incrementQuantumChessWin,
    updateProgress,
  } = useUserStore((state) => state);
  const [showTip, setShowTip] = useState<{
    state: boolean;
    message: string | null;
  }>({
    state: false,
    message: null,
  });
  const [showKnowledge, setShowKnowledge] = useState(false);
  useEffect(() => {
    setTimeout(() => {
      if (gameOver === 0)
        setShowTip({
          state: true,
          message:
            "Tip: Use Superposition move or Entanglement move to gain advantage! Read more ",
        });
    }, 2000);
  }, [gameOver]);

  useEffect(() => {
    if (showTip) {
      const timer = setTimeout(
        () => setShowTip({ state: false, message: "" }),
        10000
      );
      return () => clearTimeout(timer);
    }
  }, [showTip]);

  useEffect(() => {
    if (winner) {
      console.log("update xp");
      updateRankAndXp(null, (gameProfile?.xp || 0) + playerXP);
      if (winner === playerColor) {
        incrementQuantumChessWin();
        updateProgress({ quantumChessSkills: 200 });
      } else updateProgress({ quantumChessSkills: 100 });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    incrementQuantumChessWin,
    playerColor,
    playerXP,
    updateProgress,
    updateRankAndXp,
    winner,
  ]);

  return (
    <div className="relative h-[92vh] flex flex-col lg:flex-row">
      <Tips
        text={showTip.message || ""}
        show={showTip.state}
        setShowKnowledge={setShowKnowledge}
      />
      <Canvas camera={{ position: [0, 7, -4] }}>
        <Suspense fallback={null}>
          {gameOver === -1 && <IntroCameraRig />}
          {gameOver === 1 && (
            <TransitionCameraRig target={new THREE.Vector3(0, 7, -4)} />
          )}
          {gameOver === 0 && <ResetCameraOnStart />}
          <ambientLight intensity={1} />
          <pointLight position={[10, 10, 10]} intensity={3} />
          <hemisphereLight
            color="#ffffff"
            groundColor="#b4b4b4"
            intensity={0.6}
          />
          <Environment files="/hdr/clear_sky.hdr" background />
          <OrbitControls enabled={gameOver === 0} />
          <ChessBoard />
          <PiecesGroup nodes={nodes} />
        </Suspense>
      </Canvas>

      {showKnowledge && (
        <div
          className="
        absolute left-1/2 top-1/8 transform -translate-x-1/2 
        bg-gradient-to-br from-purple-800/80 to-indigo-900 space-y-4 text-white p-8 rounded-2xl shadow-xl z-50
        h-[500px] w-[100%] md:w-[60%] overflow-scroll
      "
        >
          <button
            onClick={() => setShowKnowledge(false)}
            className="absolute top-4 right-4 bg-red-600 hover:bg-red-700 text-white rounded-full p-2"
            aria-label="Close"
          >
            <FaTimes />
          </button>
          {<GeneralKnowledge />}
        </div>
      )}

      <AnimatePresence>
        {gameOver === 0 && (
          <motion.div
            key="gameplay-sidebar"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", duration: 0.5 }}
            className="min-w-[300px] min-h-[200px] p-3"
          >
            {message && (
              <div className="bg-white border mb-4 border-gray-300 rounded shadow-lg p-4 text-black">
                {message}
              </div>
            )}
            <GamePlay setShowKnowledge={setShowKnowledge} />
          </motion.div>
        )}
      </AnimatePresence>

      {gameOver === -1 && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center back dark:bg-slate-900/60 ">
          <div className="pointer-events-auto flex flex-col items-center gap-6">
            <h1 className="text-4xl font-bold text-white drop-shadow-lg">
              Quantum Chess
            </h1>
            <button
              onClick={() => setGameOver(0)}
              className="rounded-2xl bg-purple-600 px-8 py-3 text-lg font-semibold text-white shadow-xl hover:bg-blue-500 transition"
            >
              Start Game
            </button>
          </div>
        </div>
      )}

      {gameOver === 1 && <ChessGameOverlay />}

      <Loader
        containerStyles={{ backgroundColor: "rgba(0,0,0,0.9)" }}
        barStyles={{ backgroundColor: "#2563eb" }}
        dataInterpolation={(p) => `Loading ${p.toFixed(0)} %`}
      />
    </div>
  );
}
