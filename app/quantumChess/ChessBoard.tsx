"use client";
import { getCoord, Grid } from "@/store/ChessBoardMapping";
import useGameStore, { Position } from "@/store/gamesStore";
import React, { useCallback, useMemo } from "react";

const ChessBoard = () => {
  const {
    boardState,
    selectedPiece,
    currentPlayer,
    validMoves,
    movePiece,
    lastMove,
  } = useGameStore((state) => state);

  const renderMoveIndicator = useMemo(() => {
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

  const getPieceColor = useCallback(
    (position: Position) => {
      if (getCoord(lastMove?.from as Grid) === `${position.x}-${position.y}`) {
        return "blue";
      } else if (
        getCoord(lastMove?.to as Grid) === `${position.x}-${position.y}`
      ) {
        return "red";
      } else return (position.x + position.y) % 2 ? "white" : "gray";
    },
    [lastMove]
  );

  const renderBoard = useMemo(() => {
    return (
      Array(8)
        // @ts-expect-error any
        .fill()
        .map((_, i) =>
          Array(8)
            // @ts-expect-error any
            .fill()
            .map((_, j) => {
              const squareKey = `${i}-${j}`;
              return (
                <React.Fragment key={squareKey}>
                  <mesh
                    position={[i, 0, j]}
                    onClick={() => movePiece(selectedPiece, { x: i, y: j })}
                  >
                    <boxGeometry args={[1, 0.1, 1]} />
                    {selectedPiece?.position.x === i &&
                    selectedPiece?.position.y === j ? (
                      <meshStandardMaterial color="gold" />
                    ) : (
                      <meshStandardMaterial
                        color={getPieceColor({ x: i, y: j })}
                      />
                    )}
                  </mesh>
                </React.Fragment>
              );
            })
        )
    );
  }, [selectedPiece, getPieceColor, movePiece]);

  return (
    <group position={[-3.5, 0, -3.5]}>
      {renderBoard}
      {selectedPiece && renderMoveIndicator}
    </group>
  );
};

export default ChessBoard;
