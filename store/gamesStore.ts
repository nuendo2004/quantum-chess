import { create } from "zustand";
import { getAllAvailableMoves } from "./tranditionalRule";
import InitialBoardState from "./initialPiecesState";
//@ts-expect-error no type for chess
import { Game } from "js-chess-engine";
import { getBoardName, getGridName } from "./ChessBoardMapping";

export type Position = { x: number; y: number };

export type Piece = {
  id: string;
  type: string;
  color: string;
  positions: Position[];
  offside?: {
    x: number;
    y: number;
    z: number;
  };
};

export type QuantumState = {
  activeMoveType: "superposition" | "entanglement" | "tunneling" | null;
  quantumTokens: { white: number; black: number };
};

export type Superposition = {
  clone: Piece;
  captured: Piece[];
  timeLeft: number;
};
interface GameState {
  game: Game;
  boardState: Map<string, Piece>;
  playerColor: "white" | "black";
  currentPlayer: "white" | "black";
  quantumState: QuantumState;
  selectedPiece: Piece | null;
  validMoves: Position[];
  lastMove: {
    from: string;
    to: string;
  } | null;
  moves: { pieceId: string; positions: Position }[];
  setSuperposition: () => void;
  movePiece: (piece: Piece, newPosition: Position) => void;
  handlePieceClick: (piece: Piece) => void;
  makeMove: (pos: Position, newPosition: Position[]) => void;
  gameScore: number;
  message: null | string;
  superpositions: Superposition;
  spawnPiece: (piece: Piece) => void;
  selectedSuperposition: {
    original: Superposition | null;
    clone: Superposition | null;
  } | null;
  initializeSuperposition: (p: Piece) => void;
  isSuperposed: (p: Piece) => boolean;
}

const useGameStore = create<GameState>((set, get) => ({
  currentPlayer: "white" as const,
  playerColor: "white" as const,
  boardState: InitialBoardState,
  moves: [],
  quantumState: {
    activeMoveType: null,
    quantumTokens: { white: 3, black: 3 },
  },
  selectedPiece: null,
  validMoves: [],
  game: new Game(),
  gameScore: 0,
  lastMove: null,
  message: null,
  superpositions: new Map(),
  selectedSuperposition: null,

  // ========================================== Classic Moves ====================================================
  isSuperposed: (piece: Piece) => {
    return (
      piece.id == get().selectedSuperposition?.original?.id ||
      piece.id == get().selectedSuperposition?.clone?.id
    );
  },
  movePiece: (piece, newPosition) => {
    if (get().game.exportJson().checkMate) {
      console.log("check");
      set((state) => ({ ...state, message: "Check Mate!" }));
      return;
    }
    if (get().message) set((state) => ({ ...state, message: null }));
    const targetId = `${newPosition.x}-${newPosition.y}`;
    const previousPosition = `${piece.positions[0].x}-${piece.positions[0].y}`;
    set((state) => {
      const currentBoardState = get().boardState;
      const targetPiece = currentBoardState.get(targetId);

      const newBoardState = new Map(currentBoardState);
      console.log(piece);
      newBoardState.delete(previousPosition);
      if (targetPiece) {
        // capture
        newBoardState.delete(targetId);
        if (state.isSuperposed(piece)) {
          if (state.currentPlayer === state.playerColor) {
            if (piece.id === state.selectedSuperposition?.original?.clone.id) {
              set({
                selectedSuperposition: {
                  ...state.selectedSuperposition,
                  original: {
                    ...state.selectedSuperposition.original,
                    captured: [
                      ...state.selectedSuperposition.original.captured,
                      targetPiece,
                    ],
                  },
                },
              });
            } else {
              set({
                selectedSuperposition: {
                  ...state.selectedSuperposition,
                  clone: {
                    ...state.selectedSuperposition.clone,
                    captured: [
                      ...state.selectedSuperposition.clone.captured,
                      targetPiece,
                    ],
                  },
                },
              });
            }
          } else {
          }
        }
        if (state.currentPlayer === state.playerColor) {
          state.gameScore += 100;
        } else state.gameScore -= 100;
      }
      const updatedMovingPiece: Piece = { ...piece, positions: [newPosition] };
      newBoardState.set(targetId, updatedMovingPiece);
      if (
        piece.id == get().selectedSuperposition?.original?.id &&
        !get().selectedSuperposition?.clone
      ) {
        // get().spawnPiece(piece);
        newBoardState.set(previousPosition, {
          ...piece,
          id: piece.id + "-copy",
        });
        return {
          ...state,
          boardState: newBoardState,
          selectedSuperposition: {
            // eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain
            original: { ...state.selectedSuperposition?.original! },
            clone: piece,
          },
        };
      }
      // player move
      if (state.currentPlayer === state.playerColor) {
        try {
          state.game.move(
            //@ts-expect-error no type for chess
            getBoardName(previousPosition),
            //@ts-expect-error no type for chess
            getBoardName(targetId)
          );
        } catch {
          return {
            ...state,
            message: "Thats not going to work, look at your king!",
          };
        }
      }
      return {
        ...state,
        boardState: newBoardState,
        currentPlayer: state.currentPlayer === "white" ? "black" : "white",
      };
    });
    // ai move
    if (get().currentPlayer !== get().playerColor) {
      console.log("ai is making a move");
      setTimeout(() => {
        const move = get().game.aiMove(1);
        const [[start, end]] = Object.entries<string>(move);
        //@ts-expect-error no type for chess
        const startPiece = get().boardState.get(getGridName(start));
        if (!startPiece) {
          throw Error("AI is just dumb, and it made a mistake.");
        }
        //@ts-expect-error no type for chess
        const targetPos = getGridName(end);
        get().movePiece(startPiece, {
          x: Number(targetPos.split("-")[0]),
          y: Number(targetPos.split("-")[1]),
        });
        set({
          selectedPiece: null,
          lastMove: { from: start, to: end },
        });
      }, Math.floor(Math.random() * (800 - 300 + 1) + 500));
    }
  },

  handlePieceClick: (piece: Piece) => {
    if (get().currentPlayer !== get().playerColor) return;
    const previous = get().selectedPiece;
    const currentValidMoves = getAllAvailableMoves(piece, get().boardState);
    // select another piece
    if (!previous || piece.color === get().currentPlayer) {
      set((state) => ({
        ...state.quantumState,
        selectedPiece: piece,
        validMoves: currentValidMoves,
      }));
      return;
    }
    const previousValidMoves = getAllAvailableMoves(previous, get().boardState);
    if (
      previousValidMoves.some(
        (mv) => mv.x === piece.positions[0].x && mv.y === piece.positions[0].y
      )
    ) {
      get().movePiece(previous, piece.positions[0]);
    } else {
      set((state) => ({
        ...state.quantumState,
        selectedPiece: piece,
        validMoves: currentValidMoves,
      }));
      // update the select superpos if user click somethingelse
      if (piece.id == get().selectedSuperposition?.original?.clone.id) {
        get().initializeSuperposition(piece);
      }
      return;
    }
  },
  spawnPiece: (piece: Piece) => {
    const newBoard = new Map(get().boardState);
    newBoard.set(`${piece.positions[0].x}-${piece.positions[0].y}`, piece);
    set({
      boardState: newBoard,
    });
  },
  makeMove: (pos: Position, validMoves: Position[]) => {
    if (get().currentPlayer !== get().selectedPiece?.color) return;
    const piece = get().boardState.get(pos.x + "-" + pos.y);
    if (piece && piece.color === get().currentPlayer) return;
    const selected = get().selectedPiece;
    if (!selected) return;
    else {
      if (validMoves.some((mv) => mv.x == pos.x && mv.y == pos.y)) {
        get().movePiece(selected, pos);
      }
    }
  },

  // ========================================== Quantum Moves ====================================================

  initializeSuperposition: (piece: Piece) => {
    set({
      // if captured or run out of time, it will collapse
      selectedSuperposition: {
        original: {
          clone: piece,
          captured: [],
          timeLeft: 3,
        },
        clone: null,
      },
    });
  },
  addSuperposition: (piece: Piece, clone: Piece) => {
    const newMap = new Map(get().superpositions);
    newMap.set(`${piece.positions[0].x}-${piece.positions[0].y}`, {
      clone: clone,
      isCaptured: false,
      captured: [],
      timeLeft: 2,
    });
  },

  setSuperposition: () => {
    const state = get();
    // if (!piece || piece.quantumMovesLeft <= 0) return;
    const newBoardState = new Map(state.boardState);
    newBoardState.set(
      `${state.selectedPiece!.positions[0].x}-${
        state.selectedPiece!.positions[0].y
      }`,
      {
        ...state.selectedPiece!,
        isSuperposed: true,
      }
    );
    console.log(state.selectedPiece);
  },
}));

export default useGameStore;
