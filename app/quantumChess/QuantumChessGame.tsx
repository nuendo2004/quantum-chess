"use client";
import { Canvas } from "@react-three/fiber";
import { Environment, OrbitControls } from "@react-three/drei";
import ChessBoard from "./ChessBoard";
import PiecesGroup from "./PiecesGroup";
import { useGLTF } from "@react-three/drei";
import { DirectionalLightHelper } from "three";

export default function QuantumChessGame() {
  const { nodes } = useGLTF("/model/chess_set_new.glb");
  console.log(nodes);
  return (
    <div className="h-[100vh]">
      <Canvas camera={{ position: [0, 10, 15] }}>
        <ambientLight intensity={1} />
        <pointLight position={[10, 10, 10]} intensity={3} />
        <Environment files="/hdr/clear_sky.hdr" background />
        {/* <Environment preset="sunset" background /> */}
        {/* <Striplight position={[10, 2, 0]} scale={[1, 3, 10]} />
          <Striplight position={[-10, 2, 0]} scale={[1, 3, 10]} />
          <mesh scale={100}>
            <sphereGeometry args={[1, 64, 64]} />
            <LayerMaterial side={THREE.BackSide}>
              <Base color="blue" alpha={1} mode="normal" />
              <Depth
                colorA="#00ffff"
                colorB="#ff8f00"
                alpha={0.5}
                mode="normal"
                near={0}
                far={300}
                origin={[100, 100, 100]}
              />
              <Noise mapping="local" type="cell" scale={0.5} mode="softlight" />
            </LayerMaterial>
          </mesh> */}
        {/* <directionalLightHelper args={[lightRef, 5]} /> */}
        <hemisphereLight
          color="#ffffff"
          groundColor="#b4b4b4"
          intensity={0.6}
        />
        <ChessBoard />
        <PiecesGroup nodes={nodes} />
        <OrbitControls />
      </Canvas>
    </div>
  );
}
