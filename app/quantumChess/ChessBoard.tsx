"use client";
import useGameStore from "@/store/gamesStore";
import React, { useEffect, useMemo, useState } from "react";

const ChessBoard = () => {
  const {
    boardState,
    pieces,
    setInitialBoardState,
    selectedPiece,
    currentPlayer,
    validMoves,
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

  const renderMoveIndicator = useMemo(() => {
    console.log(selectedPiece, currentPlayer[0]);
    if (!selectedPiece || selectedPiece.color[0] !== currentPlayer[0]) return;
    const moveMap = [];
    for (const mv of validMoves) {
      const grid = `${mv.x}-${mv.y}`;
      if (boardState.has(grid)) {
        moveMap.push({
          x: mv.x,
          y: mv.y,
          isOccupid: true,
        });
      } else {
        moveMap.push({
          x: mv.x,
          y: mv.y,
          isOccupid: false,
        });
      }
    }

    return moveMap.map((mv) => {
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
  }, [selectedPiece, currentPlayer, boardState, validMoves]);

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
                onClick={() => makeMove({ x: i, y: j }, validMoves)}
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
  }, [selectedPiece, makeMove, validMoves]);

  return (
    <group position={[-3.5, 0, -3.5]}>
      {renderBoard}
      {selectedPiece && renderMoveIndicator}
    </group>
  );
};

export default ChessBoard;
