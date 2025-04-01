"use client";
import { Canvas } from "@react-three/fiber";
import { Environment, OrbitControls } from "@react-three/drei";
import ChessBoard from "./ChessBoard";
import PiecesGroup from "./PiecesGroup";
import { useGLTF } from "@react-three/drei";
import useGameStore from "@/store/gamesStore";
import { useEffect } from "react";

export default function QuantumChessGame() {
  const { nodes } = useGLTF("/model/chess_set_new.glb");
  const { selectedPiece: select, currentPlayer } = useGameStore(
    (state) => state
  );

  useEffect(() => {
    console.log(select?.positions);
  }, [select]);
  return (
    <div className="h-[100vh] flex">
      <Canvas camera={{ position: [0, 10, 15] }}>
        <ambientLight intensity={1} />
        <pointLight position={[10, 10, 10]} intensity={3} />
        <Environment files="/hdr/clear_sky.hdr" background />
        <hemisphereLight
          color="#ffffff"
          groundColor="#b4b4b4"
          intensity={0.6}
        />
        <ChessBoard />
        <PiecesGroup nodes={nodes} />
        <OrbitControls />
      </Canvas>
      <div className="min-w-[300px]">
        <h2>Current Turn: {currentPlayer}</h2>
        <h2>Score: {}</h2>
      </div>
    </div>
  );
}
