"use client";
import { Canvas } from "@react-three/fiber";
import { Environment, OrbitControls, Html, Billboard } from "@react-three/drei";
import ChessBoard from "./ChessBoard";
import PiecesGroup from "./PiecesGroup";
import { useGLTF } from "@react-three/drei";
import GamePlay from "./GamePlay";
import useGameStore from "@/store/gamesStore";

export default function QuantumChessGame() {
  const { nodes } = useGLTF("/model/chess_set_new.glb");
  const { message } = useGameStore((state) => state);

  return (
    <div className="h-[92vh] lg:h-[92vh] flex flex-col lg:flex-row">
      <Canvas camera={{ position: [0, 7, -4] }}>
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
        {message && (
          <Billboard position={[-0.5, 4, 1]}>
            <Html>
              <div className="bg-white border w-100 border-gray-300 rounded shadow-lg p-4 text-black">
                <p>{message}</p>
              </div>
            </Html>
          </Billboard>
        )}
      </Canvas>
      <div className="min-w-[300px] min-h-[200]px p-3">
        <GamePlay />
      </div>
    </div>
  );
}
