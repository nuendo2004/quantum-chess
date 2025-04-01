import { create } from "zustand";
import InitialPieces from "./initialPiecesState";

// --- Types ---
export type Position = { x: number; y: number };

export type Piece = {
  id: string;
  type: string;
  color: string;
  positions: Position[];
  isSuperposed: boolean;
  entangledWith?: string;
  tunnelingUsed?: boolean;
  quantumMovesLeft: number;
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

const getAllAvaliableMoves = (piece: Piece) => {
  console.log(piece.type);
  if (piece.type == "Pawn_b" || "Pawn_w") {
    const pos = [];
    const variation = [
      { x: 1, y: 0 },
      { x: -1, y: 0 },
      { x: 0, y: 1 },
      { x: 0, y: -1 },
    ];
    for (const vr of variation) {
      if (vr.x < 8 && vr.y < 8)
        pos.push({
          x: piece.positions[0].x + vr.x,
          y: piece.positions[0].y + vr.y,
        });
    }
    console.log(pos);
    return pos;
  }
  return [];
};

interface GameState {
  pieces: Piece[];
  boardState: Map<string, Piece>;
  currentPlayer: "white" | "black";
  quantumState: QuantumState;
  selectedPiece: Piece | null;
  moves: { pieceId: string; positions: Position }[];
  setSuperposition: (pieceId: string, positions: Position[]) => void;
  entanglePieces: (piece1Id: string, piece2Id: string) => void;
  getPieceAtPosition: (x: number, y: number) => Piece[];
  movePiece: (pieceId: string, newPosition: Position) => void;
  collapseSuperposition: (pieceId: string, triggerPosition: Position) => void;
  setQuantumMoveType: (moveType: QuantumState["activeMoveType"]) => void;
  isValidMove: (piece: Piece, target: Position) => boolean;
  handlePieceClick: (piece: Piece) => void;
  setInitialBoardState: (board: Map<string, string>) => void;
  makeMove: (pos: Position, newPosition: any) => void;
  getValidMoves: (
    piece: Piece
  ) => { x: number; y: number; isOccupid: boolean }[];
}

// --- Initial Setup ---
const initialPieces: Piece[] = InitialPieces;

// --- Helper Functions ---
const distance = (a: Position, b: Position) =>
  Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2);

const getClassicalMoves = (piece: Piece): Position[] => {
  const currentPos = piece.positions[0];
  const moves: Position[] = [];

  switch (piece.type) {
    case "pawn": {
      const direction = piece.color === "white" ? 1 : -1;
      // Standard pawn move
      moves.push({ x: currentPos.x, y: currentPos.y + direction });
      if (!piece.tunnelingUsed) {
        moves.push({ x: currentPos.x, y: currentPos.y + 2 * direction });
      }
      break;
    }
    case "knight": {
      // L-shaped moves for knight
      [-2, -1, 1, 2].forEach((dx) =>
        [-2, -1, 1, 2].forEach((dy) => {
          if (Math.abs(dx) !== Math.abs(dy)) {
            moves.push({ x: currentPos.x + dx, y: currentPos.y + dy });
          }
        })
      );
      break;
    }
    // Add other piece types as needed
  }
  return moves.filter(
    (pos) => pos.x >= 0 && pos.x < 8 && pos.y >= 0 && pos.y < 8
  );
};

// --- Zustand Store ---
const useGameStore = create<GameState>((set, get) => ({
  pieces: initialPieces,
  currentPlayer: "white",
  boardState: new Map(),
  moves: [],
  quantumState: {
    activeMoveType: null,
    quantumTokens: { white: 3, black: 3 },
  },
  selectedPiece: null,

  setInitialBoardState: (newState: Map<string, Piece>) => {
    set({ boardState: newState });
  },

  setSuperposition: (pieceId, positions) => {
    const state = get();
    const piece = state.pieces.find((p) => p.id === pieceId);
    if (!piece || piece.quantumMovesLeft <= 0) return;

    set({
      pieces: state.pieces.map((p) =>
        p.id === pieceId
          ? {
              ...p,
              positions,
              isSuperposed: true,
              quantumMovesLeft: p.quantumMovesLeft - 1,
            }
          : p
      ),
      quantumState: {
        ...state.quantumState,
        quantumTokens: {
          ...state.quantumState.quantumTokens,
          [piece.color]: state.quantumState.quantumTokens[piece.color] - 1,
        },
      },
    });
  },

  entanglePieces: (piece1Id, piece2Id) => {
    const state = get();
    const piece1 = state.pieces.find((p) => p.id === piece1Id);
    const piece2 = state.pieces.find((p) => p.id === piece2Id);

    if (!piece1 || !piece2 || piece1.color !== piece2.color) return;

    set({
      pieces: state.pieces.map((p) => {
        if (p.id === piece1Id) return { ...p, entangledWith: piece2Id };
        if (p.id === piece2Id) return { ...p, entangledWith: piece1Id };
        return p;
      }),
    });
  },

  getPieceAtPosition: (x, y) => {
    return get().pieces.filter((p) =>
      p.positions.some((pos) => pos.x === x && pos.y === y)
    );
  },

  movePiece: (pieceId, newPosition) => {
    set((state) => {
      const pieces = state.pieces.map((p) => {
        if (p.id === pieceId) {
          // Handle pawn tunneling move (moving two spaces)
          if (
            p.type.startsWith("Pawn") &&
            Math.abs(newPosition.y - p.positions[0].y) === 2
          ) {
            return { ...p, positions: [newPosition], tunnelingUsed: true };
          }
          return { ...p, positions: [newPosition] };
        }
        return p;
      });

      // Determine capture using entanglement rules
      const movedPiece = pieces.find((p) => p.id === pieceId)!;
      const capturePosition = movedPiece.positions[0];
      return {
        pieces: pieces.filter((p) => {
          if (p.id === pieceId) return true;
          if (
            p.positions.some(
              (pos) =>
                pos.x === capturePosition.x && pos.y === capturePosition.y
            )
          ) {
            // Capture entangled partner if exists
            return (
              !p.entangledWith ||
              !pieces.find((p2) => p2.id === p.entangledWith)
            );
          }
          return true;
        }),
        currentPlayer: state.currentPlayer === "white" ? "black" : "white",
      };
    });
  },

  collapseSuperposition: (pieceId, triggerPosition) => {
    set((state) => {
      const piece = state.pieces.find((p) => p.id === pieceId);
      if (!piece?.isSuperposed || piece.type === "king") return state;

      const collapsedPosition = piece.positions.reduce(
        (closest, pos) =>
          distance(pos, triggerPosition) < distance(closest, triggerPosition)
            ? pos
            : closest,
        piece.positions[0]
      );

      return {
        pieces: state.pieces.map((p) =>
          p.id === pieceId
            ? {
                ...p,
                positions: [collapsedPosition],
                isSuperposed: false,
              }
            : p
        ),
      };
    });
  },

  setQuantumMoveType: (moveType) => {
    set((state) => ({
      quantumState: { ...state.quantumState, activeMoveType: moveType },
    }));
  },

  isValidMove: (piece, target) => {
    const classicalMoves = getClassicalMoves(piece);
    return classicalMoves.some((m) => m.x === target.x && m.y === target.y);
  },

  handlePieceClick: (piece: Piece) => {
    set((state) => ({
      ...state.quantumState,
      selectedPiece: piece,
    }));
  },

  makeMove: (
    pos: Position,
    validMoves: { x: number; y: number; isOccupid: boolean }[]
  ) => {
    const piece = get().boardState.get(pos.x + "-" + pos.y);
    if (piece) return;
    const selected = get().selectedPiece;
    if (!selected) return;
    else {
      if (validMoves.some((mv) => mv.x == pos.x && mv.y == pos.y)) {
        get().movePiece(selected.id, pos);
        const newMap = new Map(get().boardState);
        newMap.delete(`${selected.positions[0].x}-${selected.positions[0].y}`);
        newMap.set(`${pos.x}-${pos.y}`, get().selectedPiece);
        set((state) => ({ ...state, boardState: newMap }));
      }
    }
  },

  getValidMoves: (piece: Piece) => {
    const moves = getAllAvaliableMoves(piece);
    const bs = get().boardState;
    const result = [];
    for (const mv of moves) {
      const grid = `${mv.x}-${mv.y}`;
      if (bs.has(grid)) {
        result.push({
          x: mv.x,
          y: mv.y,
          isOccupid: true,
        });
      } else if (!bs.has(grid)) {
        result.push({
          x: mv.x,
          y: mv.y,
          isOccupid: false,
        });
      }
    }
    return result;
  },

  //   handleSquareClick: (target: Position) => {
  //       set(state => ({
  //         if (selectedPiece && isValidMove(selectedPiece, target)) {
  //             movePiece(selectedPiece.id, target);
  //             quantumState: { ...state.quantumState, selectedPiece: null }
  //       })
  //     }
  //   };
}));

export default useGameStore;
