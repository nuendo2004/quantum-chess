import useGameStore from "@/store/gamesStore";
import QuantumPiece from "./QuantumPiece";

const PiecesGroup = ({ nodes }: { nodes: any }) => {
  const pieces = useGameStore((state) => state.pieces);
  return (
    <group>
      {pieces.map((piece) => (
        <QuantumPiece key={piece.id} piece={piece} model={nodes[piece.type]} />
      ))}
    </group>
  );
};

export default PiecesGroup;
