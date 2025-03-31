"use client";
import React from "react";

const ChessBoard = () => {
  return (
    <group position={[-3.5, 0, -3.5]}>
      {Array(8)
        .fill()
        .map((_, i) =>
          Array(8)
            .fill()
            .map((_, j) => (
              <mesh key={`${i}-${j}`} position={[i, 0, j]}>
                <boxGeometry args={[1, 0.1, 1]} />
                <meshStandardMaterial color={(i + j) % 2 ? "white" : "gray"} />
              </mesh>
            ))
        )}
    </group>
  );
};

export default ChessBoard;
