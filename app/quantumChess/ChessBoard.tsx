"use client";
import { getCoord, Grid } from "@/store/ChessBoardMapping";
import useGameStore, { Position } from "@/store/gamesStore";
import { Text } from "@react-three/drei";
import React, { useCallback, useMemo } from "react";

const filesBottom = ["H", "G", "F", "E", "D", "C", "B", "A"];
const filesTop = ["H", "G", "F", "E", "D", "C", "B", "A"];
const ranksLeft = ["1", "2", "3", "4", "5", "6", "7", "8"];
const ranksRight = ["1", "2", "3", "4", "5", "6", "7", "8"];

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

  const frame = (
    <mesh position={[4, -0.06, 4]}>
      {/* 9×9 box: 8 × 8 board + 0.5-unit wooden rail all around */}
      <boxGeometry args={[9, 0.2, 9]} />
      <meshStandardMaterial color="#8B5A2B" />
    </mesh>
  );
  const letters = [
    /* bottom edge (south / White’s side) */
    ...filesBottom.map((f, i) => (
      <Text
        key={`bot-${f}`}
        position={[i + 0.5, 0.11, -0.25]} // half-square offset
        rotation={[-Math.PI / 2, 0, 0]}
        fontSize={0.25}
        color="white"
        anchorX="center"
        anchorY="middle"
      >
        {f}
      </Text>
    )),

    /* top edge (north / Black’s side) – flipped so it’s upright for the far player */
    ...filesTop.map((f, i) => (
      <Text
        key={`top-${f}`}
        position={[i + 0.5, 0.11, 8.25]}
        rotation={[-Math.PI / 2, Math.PI, 0]} // 180° turn around Y
        fontSize={0.25}
        color="white"
        anchorX="center"
        anchorY="middle"
      >
        {f}
      </Text>
    )),

    /* left edge (west) */
    ...ranksLeft.map((r, j) => (
      <Text
        key={`left-${r}`}
        position={[-0.25, 0.11, j + 0.5]}
        rotation={[-Math.PI / 2, 0, 0]}
        fontSize={0.25}
        color="white"
        anchorX="center"
        anchorY="middle"
      >
        {r}
      </Text>
    )),

    /* right edge (east) – rotated so it’s upright from that side */
    ...ranksRight.map((r, j) => (
      <Text
        key={`right-${r}`}
        position={[8.25, 0.11, j + 0.5]}
        rotation={[-Math.PI / 2, Math.PI, 0]}
        fontSize={0.25}
        color="white"
        anchorX="center"
        anchorY="middle"
      >
        {r}
      </Text>
    )),
  ];

  return (
    <group position={[-4, 0, -4]}>
      {frame}
      <group position={[0.5, 0, 0.5]}>
        {renderBoard} {selectedPiece && renderMoveIndicator}
      </group>
      {/* {renderBoard} */}

      {letters}
    </group>
  );
};

export default ChessBoard;
