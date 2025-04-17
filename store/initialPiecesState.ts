"use client";
import { Piece } from "./gamesStore";

const initialPieces: Piece[] = [
  // White pieces

  {
    id: "wR1",
    type: "Rook_w",
    color: "white",
    position: { x: 0, y: 0 },
  },
  {
    id: "wR2",
    type: "Rook_w",
    color: "white",
    position: { x: 7, y: 0 },
  },
  {
    id: "wN1",
    type: "Knight_w",
    color: "white",
    position: { x: 1, y: 0 },
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
    position: { x: 2, y: 0 },
  },
  {
    id: "wQ",
    type: "queen_w",
    color: "white",
    position: { x: 4, y: 0 },
  },
  {
    id: "wK",
    type: "King_w",
    color: "white",
    position: { x: 3, y: 0 },
  },
  {
    id: "wB2",
    type: "Bishop_w",
    color: "white",
    position: { x: 5, y: 0 },
  },
  {
    id: "wN2",
    type: "Knight_w",
    color: "white",
    position: { x: 6, y: 0 },
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
    position: { x: i, y: 1 },

    tunnelingUsed: false,
  })),

  // black
  {
    id: "bR1",
    type: "Rook_b",
    color: "black",
    position: { x: 0, y: 7 },
  },
  {
    id: "bR2",
    type: "Rook_b",
    color: "black",
    position: { x: 7, y: 7 },
  },
  {
    id: "bN1",
    type: "Knight_b",
    color: "black",
    position: { x: 6, y: 7 },
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
    position: { x: 5, y: 7 },
  },
  {
    id: "bQ",
    type: "queen_b",
    color: "black",
    position: { x: 4, y: 7 },
  },
  {
    id: "bK",
    type: "King_b",
    color: "black",
    position: { x: 3, y: 7 },
  },
  {
    id: "bB2",
    type: "Bishop_b",
    color: "black",
    position: { x: 2, y: 7 },
  },
  {
    id: "bN2",
    type: "Knight_b",
    color: "black",
    position: { x: 1, y: 7 },
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
    position: { x: i, y: 6 },
    isSuperposed: false,
    tunnelingUsed: false,
  })),
];

const InitialBoardState = new Map();

for (const ps of initialPieces) {
  InitialBoardState.set(`${ps.position.x}-${ps.position.y}`, ps);
}

export default InitialBoardState;
