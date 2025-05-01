import { baseId, Piece } from "@/store/gamesStore";
import { useMemo, useRef } from "react";
import { Mesh, Group } from "three";
import useGameStore from "@/store/gamesStore";
import { useFrame } from "@react-three/fiber";

const QuantumPiece: React.FC<{ piece: Piece; model: unknown }> = ({
  piece,
  model,
}) => {
  const groupRef = useRef<Group>(null);
  const diamondRef = useRef<Mesh>(null);
  const ringRef = useRef<Mesh>(null);

  const { x, y } = piece.position;
  const worldPos = [
    x - 3.5 + (piece.offside?.x || 0),
    0.05 + (piece.offside?.y || 0),
    y - 3.5 + (piece.offside?.z || 0),
  ];
  const { handlePieceClick, superPositions, entanglements } = useGameStore(
    (state) => state
  );

  useFrame((state, delta) => {
    if (diamondRef.current) {
      if (diamondRef.current) diamondRef.current.rotation.y += delta * 2;
      if (ringRef.current) ringRef.current.rotation.z += delta * 1.5;
    }
  });

  const diamondWorldScale = 0.1;
  const groupScale = 0.0035;
  const diamondRelativeScale = diamondWorldScale / groupScale;
  const ringRelativeScale = 0.14 / groupScale;
  const rootId = baseId(piece.id);

  const inEntanglement = useMemo(() => {
    for (const rec of entanglements.values()) {
      if (rec.allyId === piece.id || rec.enemyId === piece.id) return true;
    }
    return false;
  }, [entanglements, piece.id]);

  return (
    <group
      ref={groupRef}
      scale={[groupScale, groupScale, groupScale]}
      position={[worldPos[0], worldPos[1], worldPos[2]]}
      onClick={(e) => {
        e.stopPropagation();
        handlePieceClick(piece);
      }}
    >
      {/* @ts-expect-error Allow unknown model type for primitive */}
      <primitive object={model.clone()} />
      {superPositions.has(rootId) && (
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
      {inEntanglement && (
        <mesh
          ref={ringRef}
          rotation={[Math.PI / 2, 0, 0]}
          position={[0, 500, 0]}
          scale={[ringRelativeScale, ringRelativeScale, ringRelativeScale]}
        >
          <torusGeometry args={[1, 0.25, 8, 24]} />
          <meshStandardMaterial
            color="blue"
            emissive="blue"
            emissiveIntensity={0.8}
          />
        </mesh>
      )}
    </group>
  );
};

export default QuantumPiece;
