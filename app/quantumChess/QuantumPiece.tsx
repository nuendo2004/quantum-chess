import { Piece } from "@/store/gamesStore";
import { useRef } from "react";
import { Mesh, Group } from "three";
import useGameStore from "@/store/gamesStore";
import { useFrame } from "@react-three/fiber";

const QuantumPiece: React.FC<{ piece: Piece; model: unknown }> = ({
  piece,
  model,
}) => {
  const groupRef = useRef<Group>(null);
  const diamondRef = useRef<Mesh>(null);

  const { x, y } = piece.position;
  const worldPos = [
    x - 3.5 + (piece.offside?.x || 0),
    0.05 + (piece.offside?.y || 0),
    y - 3.5 + (piece.offside?.z || 0),
  ];
  const { handlePieceClick, superPositions } = useGameStore((state) => state);

  useFrame((state, delta) => {
    if (diamondRef.current) {
      diamondRef.current.rotation.y += delta * 2;
    }
  });

  const diamondWorldScale = 0.1;
  const groupScale = 0.0035;
  const diamondRelativeScale = diamondWorldScale / groupScale;

  return (
    <group
      ref={groupRef}
      scale={[groupScale, groupScale, groupScale]}
      position={[worldPos[0], worldPos[1], worldPos[2]]}
      onClick={(e) => {
        e.stopPropagation();
        handlePieceClick(piece);
        console.log("clicked piece group....");
      }}
    >
      {/* @ts-expect-error Allow unknown model type for primitive */}
      <primitive object={model.clone()} />
      {superPositions.has(piece.id) && (
        <mesh
          ref={diamondRef}
          position={[1, 520, 0]}
          scale={[
            diamondRelativeScale,
            diamondRelativeScale,
            diamondRelativeScale,
          ]}
        >
          <octahedronGeometry args={[1, 0]} />
          <meshStandardMaterial
            color="red"
            emissive="red"
            emissiveIntensity={1}
            wireframe={false}
          />
        </mesh>
      )}
    </group>
  );
};

export default QuantumPiece;
