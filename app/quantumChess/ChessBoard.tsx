"use client";
import useGameStore from "@/store/gamesStore";
import React, { useEffect, useMemo, useState } from "react";

const ChessBoard = () => {
  const {
    boardState,
    pieces,
    setInitialBoardState,
    selectedPiece,
    getValidMoves,
    currentPlayer,
    makeMove,
  } = useGameStore((state) => state);

  useEffect(() => {
    const newMap = new Map(boardState);
    console.log(pieces);
    pieces.map((ps) => {
      newMap.set(`${ps.positions[0].x}-${ps.positions[0].y}`, ps);
    });
    setInitialBoardState(newMap);
  }, [pieces, setInitialBoardState, selectedPiece]);

  const [availableMoves, setSvailableMoves] = useState<
    { x: number; y: number; isOccupid: boolean }[]
  >([]);

  const renderMoveIndicator = useMemo(() => {
    console.log(selectedPiece, currentPlayer[0]);
    if (!selectedPiece || selectedPiece.color[0] !== currentPlayer[0]) return;
    console.log("update");
    const moves = getValidMoves(selectedPiece);
    setSvailableMoves(moves);
    return moves.map((mv) => {
      return (
        <mesh
          position={[mv.x, 0.051, mv.y]}
          rotation={[-Math.PI / 2, 0, 0]}
          key={mv.x + "-" + mv.y}
        >
          <planeGeometry args={[1, 1]} />
          <meshStandardMaterial
            color={mv.isOccupid ? "rgba(255, 31, 31)" : "rgba(0, 255, 0)"}
            opacity={0.5}
            transparent
          />
        </mesh>
      );
    });
  }, [selectedPiece, getValidMoves, currentPlayer]);

  const renderBoard = useMemo(() => {
    return Array(8)
      .fill()
      .map((_, i) =>
        Array(8)
          .fill()
          .map((_, j) => (
            <React.Fragment key={`${i}-${j}`}>
              {/* Chessboard Square */}
              <mesh
                position={[i, 0, j]}
                onClick={() => makeMove({ x: i, y: j }, availableMoves)}
              >
                <boxGeometry args={[1, 0.1, 1]} />
                {selectedPiece?.positions[0].x === i &&
                selectedPiece?.positions[0].y === j ? (
                  <meshStandardMaterial color="gold" />
                ) : (
                  <meshStandardMaterial
                    color={(i + j) % 2 ? "white" : "gray"}
                  />
                )}
              </mesh>
            </React.Fragment>
          ))
      );
  }, [availableMoves, selectedPiece, makeMove]);

  return (
    <group position={[-3.5, 0, -3.5]}>
      {renderBoard}
      {selectedPiece && renderMoveIndicator}
    </group>
  );
};

export default ChessBoard;
