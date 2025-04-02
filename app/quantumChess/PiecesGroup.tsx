import useGameStore from "@/store/gamesStore";
import QuantumPiece from "./QuantumPiece";

const PiecesGroup = ({ nodes }: { nodes: unknown }) => {
  const pieces = useGameStore((state) => state.pieces);
  return (
    <group>
      {pieces.map((piece) => (
        //@ts-expect-error allow
        <QuantumPiece key={piece.id} piece={piece} model={nodes[piece.type]} />
      ))}
    </group>
  );
};

export default PiecesGroup;
