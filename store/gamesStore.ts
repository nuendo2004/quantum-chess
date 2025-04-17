import { create } from "zustand";
import {
  AiPieceCode,
  aiPieceMap,
  getAllAvailableMoves,
} from "./tranditionalRule";
import InitialBoardState from "./initialPiecesState";
//@ts-expect-error no type for chess
import { Game } from "js-chess-engine";
import { getGrid, getCoord, Coord, getCoordId } from "./ChessBoardMapping";

export type Position = { x: number; y: number };

export type Piece = {
  id: string;
  type: string;
  color: string;
  position: Position;
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
  movePiece: (piece: Piece, newPosition: Position) => void;
  handlePieceClick: (piece: Piece) => void;
  makeMove: (pos: Position, newPosition: Position[]) => void;
  capturePiece: (taker: Piece, loser: Piece) => void;
  moveToGrid: (piece: Piece, position: Position) => void;
  handleAiMove: () => void;
  gameScore: number;
  message: null | string;
  spawnPiece: (piece: Piece) => void;
  initializeSuperposition: (p: Piece) => void;
  superPositions: Map<string, Superposition>;
  collapsePiece: (p: Piece) => void;
  addVictim: (taker: Piece, loser: Piece) => void;
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
  selectedSuperposition: null,
  superPositions: new Map(),

  // ========================================== Classic Moves ====================================================
  movePiece: (piece, newPosition) => {
    let state = get();
    if (state.game.exportJson().checkMate) {
      console.log("check");
      set((state) => ({ ...state, message: "Check Mate!" }));
      return;
    }
    if (state.message) set((state) => ({ ...state, message: null }));

    const origianlPiece = {
      ...piece,
      id: piece.id + "-copy",
      position: newPosition,
    };
    const target = state.boardState.get(getCoordId(newPosition));

    console.log(
      piece,
      state.superPositions.has(piece.id) &&
        !state.superPositions.has(piece.id + "-copy")
    );
    if (target) {
      // it has enemy
      state.capturePiece(piece, target);
    }
    // spawn new piece
    else if (
      piece.color === get().currentPlayer &&
      !piece.id.includes("-copy") &&
      state.superPositions.has(piece.id) &&
      !state.superPositions.has(piece.id + "-copy")
    ) {
      state.spawnPiece(origianlPiece);
      return;
    } else {
      state.moveToGrid(piece, newPosition);
      if (piece.color === get().playerColor)
        get().game.move(
          getGrid(getCoordId(piece.position)),
          getGrid(getCoordId(newPosition))
        );
      set({
        currentPlayer: state.currentPlayer === "white" ? "black" : "white",
      });
    }
    console.log(get().superPositions);
    state = get();
    // AI move
    if (state.currentPlayer !== state.playerColor) {
      console.log("ai is making a move");
      setTimeout(() => {
        state.handleAiMove();
      }, Math.floor(Math.random() * (800 - 300 + 1) + 500));
    }
  },

  handleAiMove: () => {
    const move = get().game.aiMove(1);
    const [[start, end]] = Object.entries<string>(move);
    //@ts-expect-error no type for chess
    const startPiece = get().boardState.get(getCoord(start));
    if (!startPiece) {
      throw Error("AI is just dumb, and it made a mistake.");
    }
    //@ts-expect-error no type for chess
    const targetPos = getCoord(end);
    get().movePiece(startPiece, {
      x: Number(targetPos.split("-")[0]),
      y: Number(targetPos.split("-")[1]),
    });
    set({
      selectedPiece: null,
      lastMove: { from: start, to: end },
      // currentPlayer: get().currentPlayer === "white" ? "black" : "white",
    });
  },

  handlePieceClick: (piece: Piece) => {
    console.log(
      "currentClicked ",
      getGrid(getCoordId(piece.position)),
      piece.position
    );
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
        (mv) => mv.x === piece.position.x && mv.y === piece.position.y
      )
    ) {
      get().movePiece(previous, piece.position);
    }

    // else {
    //   set((state) => ({
    //     ...state.quantumState,
    //     selectedPiece: piece,
    //     validMoves: currentValidMoves,
    //   }));
    //   // update the select superpos if user click somethingelse
    //   if (piece.id == get().selectedSuperposition?.original?.clone.id) {
    //     get().initializeSuperposition(piece);
    //   }
    //   return;
    // }
  },
  spawnPiece: (piece: Piece) => {
    const pieceId: AiPieceCode = piece.id.substring(0, 2) as AiPieceCode;
    get().game.setPiece(
      getGrid(`${piece.position.x}-${piece.position.y}` as Coord),
      aiPieceMap[pieceId]
    );
    const state = new Map(get().boardState);
    state.set(getCoordId(piece.position), piece);
    get().initializeSuperposition(piece);
    set({ boardState: state });
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
    const newSup = new Map(get().superPositions);
    newSup.set(piece.id, {
      clone: piece,
      captured: [],
      timeLeft: 3,
    });
    set({
      // if captured or run out of time, it will collapse
      superPositions: newSup,
    });
  },
  addSuperposition: (piece: Piece, clone: Piece) => {
    const newMap = new Map(get().superPositions);
    newMap.set(`${piece.position.x}-${piece.position.y}`, {
      clone: clone,
      captured: [],
      timeLeft: 2,
    });
    set({
      superPositions: newMap,
    });
  },

  collapsePiece: (piece: Piece) => {
    const state = get();
    const psid = piece.id.split("-copy")[0];
    const original = state.superPositions.get(psid);
    const clone = state.superPositions.get(psid + "-copy");
    if (original && clone) {
      const rand = Math.floor(Math.random() * 2);
      let removal: Superposition;
      if (rand == 1) {
        removal = original;
      } else removal = clone;
      console.log(removal.clone);
      const newSup = new Map(state.superPositions);
      const newBoard = new Map(state.boardState);
      newSup.delete(clone.clone.id);
      newSup.delete(original.clone.id);
      if (removal.clone.id !== piece.id) {
        console.log(getCoordId(removal.clone.position));
        newBoard.delete(getCoordId(removal.clone.position));
        state.game.removePiece(getGrid(getCoordId(removal.clone.position)));
      } else {
        newBoard.set(getCoordId(removal.clone.position), {
          ...removal.clone,
          id: psid,
        });
      }
      set({
        boardState: newBoard,
        superPositions: newSup,
        message:
          removal.clone.id !== piece.id
            ? `Collapse triggered, you have lost ${removal.clone.type}.`
            : `Collapse triggered, you ${removal.clone.type} has reset its state.`,
      });
    }
  },

  capturePiece: (taker: Piece, loser: Piece) => {
    if (get().superPositions.has(loser.id)) {
      get().collapsePiece(loser);
    } else if (get().superPositions.has(taker.id)) {
      get().addVictim(taker, loser);
    }
    const currentBoardState = get().boardState;
    const newBoardState = new Map(currentBoardState);
    newBoardState.delete(getCoordId(taker.position));
    newBoardState.set(getCoordId(loser.position), {
      ...taker,
      position: loser.position,
    });
    // update superposition
    const newSup = new Map(get().superPositions);
    const sps = get().superPositions.get(taker.id);
    if (sps) {
      newSup.set(taker.id, {
        ...sps,
        clone: { ...sps.clone, position: loser.position },
      });
    }

    set({
      superPositions: newSup,
      boardState: newBoardState,
      currentPlayer: get().currentPlayer === "white" ? "black" : "white",
    });
    if (taker.color === get().playerColor)
      get().game.move(
        getGrid(getCoordId(taker.position)),
        getGrid(getCoordId(loser.position))
      );
  },

  moveToGrid: (piece: Piece, position: Position) => {
    console.log(piece.position, position);
    const currentBoardState = get().boardState;
    const newBoardState = new Map(currentBoardState);
    newBoardState.delete(getCoordId(piece.position));
    newBoardState.set(getCoordId(position), { ...piece, position });
    const newSup = new Map(get().superPositions);
    const sps = get().superPositions.get(piece.id);
    console.log(sps);
    if (sps) {
      newSup.set(piece.id, {
        ...sps,
        clone: { ...sps.clone, position: position },
      });
    }
    set({
      boardState: newBoardState,
      selectedPiece: null,
      superPositions: newSup,
    });
  },

  addVictim: (taker: Piece, loser: Piece) => {
    const sup = get().superPositions.get(taker.id);
    if (!sup) return;
    const newSuperPositions = new Map(get().superPositions);
    newSuperPositions.set(taker.id, {
      ...sup,
      captured: [...sup.captured, loser],
      timeLeft: (sup.timeLeft -= 1),
    });
  },
}));

export default useGameStore;
