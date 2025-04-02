import { Piece } from "@/store/gamesStore";
import { useRef } from "react";
import { Mesh } from "three";
import useGameStore from "@/store/gamesStore";

const QuantumPiece: React.FC<{ piece: Piece; model: unknown }> = ({
  piece,
  model,
}) => {
  const ref = useRef<Mesh>(null);

  // Use the first position (classical position) to render the piece.
  const { x, y } = piece.positions[0];
  const worldPos = [
    x - 3.5 + (piece.offside?.x || 0),
    0.05 + (piece.offside?.y || 0),
    y - 3.5 + (piece.offside?.z || 0),
  ];
  const handlePieceClick = useGameStore((state) => state.handlePieceClick);

  return (
    <mesh
      ref={ref}
      scale={[0.0035, 0.0035, 0.0035]}
      position={[worldPos[0], worldPos[1], worldPos[2]]}
      onClick={(e) => {
        e.stopPropagation();
        handlePieceClick(piece);
        console.log("clicked ....");
      }}
    >
      {/* @ts-expect-error allow */}
      <primitive object={model.clone()} />
    </mesh>
  );
};

export default QuantumPiece;
