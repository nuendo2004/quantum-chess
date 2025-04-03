import useGameStore from "@/store/gamesStore";
import QuantumPiece from "./QuantumPiece";
import { useEffect, useMemo } from "react";

const PiecesGroup = ({ nodes }: { nodes: unknown }) => {
  const pieces = useGameStore((state) => state.boardState);

  useEffect(() => {
    console.log(pieces)
  }, [pieces])

  const chessGroup = useMemo(() => {
    return Array.from(pieces).map(([id, piece]) => (
      //@ts-expect-error allow
      <QuantumPiece key={id} piece={piece} model={nodes[piece.type]} />
    ))
  }, [pieces])

  return (
    <group>
      {chessGroup}
    </group>
  );
};

export default PiecesGroup;
