"use client";
import { Piece } from "./gamesStore";

const initialPieces: Piece[] = [
  // White pieces

  {
    id: "wR1",
    type: "Rook_w",
    color: "white",
    positions: [{ x: 0, y: 0 }],
    isSuperposed: false,
    quantumMovesLeft: 1,
  },
  {
    id: "wR2",
    type: "Rook_w",
    color: "white",
    positions: [{ x: 7, y: 0 }],
    isSuperposed: false,
    quantumMovesLeft: 1,
  },
  {
    id: "wN1",
    type: "Knight_w",
    color: "white",
    positions: [{ x: 1, y: 0 }],
    isSuperposed: false,
    quantumMovesLeft: 2,
    offside: {
      x: 0,
      y: 0.225,
      z: 0,
    },
  },
  {
    id: "wB1",
    type: "Bishop_w",
    color: "white",
    positions: [{ x: 2, y: 0 }],
    isSuperposed: false,
    quantumMovesLeft: 1,
  },
  {
    id: "wQ",
    type: "queen_w",
    color: "white",
    positions: [{ x: 3, y: 0 }],
    isSuperposed: false,
    quantumMovesLeft: 1,
  },
  {
    id: "wK",
    type: "King_w",
    color: "white",
    positions: [{ x: 4, y: 0 }],
    isSuperposed: false,
    quantumMovesLeft: 0,
  },
  {
    id: "wB2",
    type: "Bishop_w",
    color: "white",
    positions: [{ x: 5, y: 0 }],
    isSuperposed: false,
    quantumMovesLeft: 1,
  },
  {
    id: "wN2",
    type: "Knight_w",
    color: "white",
    positions: [{ x: 6, y: 0 }],
    isSuperposed: false,
    quantumMovesLeft: 2,
    offside: {
      x: 0,
      y: 0.225,
      z: 0,
    },
  },
  ...Array.from({ length: 8 }, (_, i) => ({
    id: `wP${i + 1}`,
    type: "Pawn_w",
    color: "white",
    positions: [{ x: i, y: 1 }],
    isSuperposed: false,
    tunnelingUsed: false,
    quantumMovesLeft: 1,
  })),

  // black
  {
    id: "bR1",
    type: "Rook_b",
    color: "black",
    positions: [{ x: 0, y: 7 }],
    isSuperposed: false,
    quantumMovesLeft: 1,
  },
  {
    id: "bR2",
    type: "Rook_b",
    color: "black",
    positions: [{ x: 7, y: 7 }],
    isSuperposed: false,
    quantumMovesLeft: 1,
  },
  {
    id: "bN1",
    type: "Knight_b",
    color: "black",
    positions: [{ x: 6, y: 7 }],
    isSuperposed: false,
    quantumMovesLeft: 2,
    offside: {
      x: 0,
      y: 0.225,
      z: 0,
    },
  },
  {
    id: "bB1",
    type: "Bishop_b",
    color: "black",
    positions: [{ x: 5, y: 7 }],
    isSuperposed: false,
    quantumMovesLeft: 1,
  },
  {
    id: "bQ",
    type: "queen_b",
    color: "black",
    positions: [{ x: 3, y: 7 }],
    isSuperposed: false,
    quantumMovesLeft: 1,
  },
  {
    id: "bK",
    type: "King_b",
    color: "black",
    positions: [{ x: 4, y: 7 }],
    isSuperposed: false,
    quantumMovesLeft: 0,
  },
  {
    id: "bB2",
    type: "Bishop_b",
    color: "black",
    positions: [{ x: 2, y: 7 }],
    isSuperposed: false,
    quantumMovesLeft: 1,
  },
  {
    id: "bN2",
    type: "Knight_b",
    color: "black",
    positions: [{ x: 1, y: 7 }],
    isSuperposed: false,
    quantumMovesLeft: 2,
    offside: {
      x: 0,
      y: 0.225,
      z: 0,
    },
  },
  ...Array.from({ length: 8 }, (_, i) => ({
    id: `bP${i + 1}`,
    type: "Pawn_b",
    color: "black",
    positions: [{ x: i, y: 6 }],
    isSuperposed: false,
    tunnelingUsed: false,
    quantumMovesLeft: 1,
  })),
];

const InitialBoardState = new Map()

for (let ps of initialPieces) {
  InitialBoardState.set(`${ps.positions[0].x}-${ps.positions[0].y}`, ps)
}

export default InitialBoardState;
