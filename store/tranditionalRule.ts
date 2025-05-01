import { getCoord, getCoordId, getGrid, Grid } from "./ChessBoardMapping";
import { Piece } from "./gamesStore";

type AiPieceCode = keyof typeof aiPieceMap;
const aiPieceMap = {
  wR: "R",
  wN: "N",
  wB: "B",
  wQ: "Q",
  wK: "K",
  wP: "P",
  bR: "r",
  bN: "n",
  bB: "b",
  bQ: "q",
  bK: "k",
  bP: "p",
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getAllAvailableMoves = (piece: Piece, game: any) => {
  const id = getGrid(getCoordId(piece.position));
  return game.moves(id).map((grid: Grid) => {
    const coord = getCoord(grid).split("-");
    return {
      x: Number(coord[0]),
      y: Number(coord[1]),
    };
  });
};

const playMoveSound = () => {
  const sound = new Audio("/sounds/chess1.wav");
  sound.volume = 0.5;
  sound.play();
};

const playCaptureSound = () => {
  const sound = new Audio("/sounds/capture.mp3");
  sound.volume = 0.5;
  sound.play();
};

const playSuperpositionSound = () => {
  const sound = new Audio("/sounds/superposition.wav");
  sound.volume = 0.5;
  sound.play();
};

const playCollapseSound = () => {
  const sound = new Audio("/sounds/collapse.wav");
  sound.volume = 0.5;
  sound.play();
};

const playEntanglementSound = () => {
  const sound = new Audio("/sounds/entanglement.wav");
  sound.volume = 0.5;
  sound.play();
};

const playCheck = () => {
  const sound = new Audio("/sounds/check.mp3");
  sound.volume = 0.5;
  sound.play();
};

export {
  getAllAvailableMoves,
  aiPieceMap,
  playCaptureSound,
  playMoveSound,
  playSuperpositionSound,
  playEntanglementSound,
  playCollapseSound,
  playCheck,
};
export type { AiPieceCode };
