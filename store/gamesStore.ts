import { create } from "zustand";
import InitialPieces from "./initialPiecesState";
import { getAllAvailableMoves } from "./tranditionalRule";

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

interface GameState {
  pieces: Piece[];
  boardState: Map<string, Piece>;
  currentPlayer: "white" | "black";
  quantumState: QuantumState;
  selectedPiece: Piece | null;
  validMoves: Position[];
  moves: { pieceId: string; positions: Position }[];
  setSuperposition: (pieceId: string, positions: Position[]) => void;
  entanglePieces: (piece1Id: string, piece2Id: string) => void;
  getPieceAtPosition: (x: number, y: number) => Piece[];
  movePiece: (piece: Piece, newPosition: Position) => void;
  collapseSuperposition: (pieceId: string, triggerPosition: Position) => void;
  setQuantumMoveType: (moveType: QuantumState["activeMoveType"]) => void;
  isValidMove: (piece: Piece, target: Position) => boolean;
  handlePieceClick: (piece: Piece) => void;
  setInitialBoardState: (board: Map<string, string>) => void;
  makeMove: (pos: Position, newPosition: Position[]) => void;
}

// --- Initial Setup ---
const initialPieces: Piece[] = InitialPieces;

// --- Helper Functions ---
const distance = (a: Position, b: Position) =>
  Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2);

// const getClassicalMoves = (piece: Piece): Position[] => {
//   const currentPos = piece.positions[0];
//   const moves: Position[] = [];

//   switch (piece.type) {
//     case "pawn": {
//       const direction = piece.color === "white" ? 1 : -1;
//       // Standard pawn move
//       moves.push({ x: currentPos.x, y: currentPos.y + direction });
//       if (!piece.tunnelingUsed) {
//         moves.push({ x: currentPos.x, y: currentPos.y + 2 * direction });
//       }
//       break;
//     }
//     case "knight": {
//       // L-shaped moves for knight
//       [-2, -1, 1, 2].forEach((dx) =>
//         [-2, -1, 1, 2].forEach((dy) => {
//           if (Math.abs(dx) !== Math.abs(dy)) {
//             moves.push({ x: currentPos.x + dx, y: currentPos.y + dy });
//           }
//         })
//       );
//       break;
//     }
//     // Add other piece types as needed
//   }
//   return moves.filter(
//     (pos) => pos.x >= 0 && pos.x < 8 && pos.y >= 0 && pos.y < 8
//   );
// };

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

  movePiece: (piece, newPosition) => {
    set((state) => {
      const targetId = `${newPosition.x}-${newPosition.y}`;
      const movingPieceId = piece.id; // Store the ID of the piece being moved

      // Get the current board state and the target piece (if any)
      const currentBoardState = get().boardState;
      const targetPiece = currentBoardState.get(targetId); // Piece at the destination

      // Create the updated representation of the moving piece
      const updatedMovingPiece: Piece = { ...piece, positions: [newPosition] };

      let finalPiecesArray: Piece[];
      const newBoardState = new Map(currentBoardState); // Create a mutable copy of the board state

      // --- Update boardState: Clear the piece's old position ---
      // Assume piece.positions[0] holds the current/old position before the move
      if (piece.positions && piece.positions.length > 0) {
        const oldPosition = piece.positions[0];
        const oldPositionId = `${oldPosition.x}-${oldPosition.y}`;
        // Verify the piece being moved was actually at the old position before deleting
        if (newBoardState.get(oldPositionId)?.id === movingPieceId) {
          newBoardState.delete(oldPositionId);
        }
      } else {
        console.warn(
          "Moving piece lacks position info to clear its old square",
          piece
        );
        // Might need alternative logic if position isn't stored this way
      }

      // --- Check for Capture ---
      if (targetPiece && targetPiece.color !== get().currentPlayer) {
        // --- Capture Logic ---

        // 1. Update boardState: Place moving piece on target square (overwrites target)
        newBoardState.set(targetId, updatedMovingPiece);

        // 2. Update pieces array:
        //    a. Filter out the captured piece (targetPiece)
        //    b. Map over the remaining pieces to update the moving piece's position
        finalPiecesArray = state.pieces
          .filter((p) => p.id !== targetPiece.id) // Remove captured piece
          .map((p) => (p.id === movingPieceId ? updatedMovingPiece : p)); // Update moving piece
      } else if (targetPiece && targetPiece.color === get().currentPlayer) {
        // --- Invalid Move: Trying to move onto own piece ---
        console.error("Invalid move: Cannot capture own piece.");
        // Return the original state without changes (or handle as an error)
        return state;
      } else {
        // --- Simple Move Logic (No Capture) ---

        // 1. Update boardState: Place moving piece on the empty target square
        newBoardState.set(targetId, updatedMovingPiece);

        // 2. Update pieces array: Just update the moving piece's position
        finalPiecesArray = state.pieces.map((p) =>
          p.id === movingPieceId ? updatedMovingPiece : p
        );
      }

      // --- Return the final updated state ---
      return {
        ...state,
        boardState: newBoardState, // Return the updated board state map
        pieces: finalPiecesArray, // Return the correctly filtered/updated pieces array
        currentPlayer: state.currentPlayer === "white" ? "black" : "white",
      };
    });

    // set((state) => {
    //   const pieces = state.pieces.map((p) => {
    //     if (p.id === pieceId) {
    //       // Common for all pieces: Update position
    //       const updatedPiece = { ...p, positions: [newPosition] };

    //       // Handle piece-specific logic
    //       switch (true) {
    //         // --- Pawn Logic ---
    //         case p.type.startsWith("Pawn"):
    //           // Tunneling (two-square move)
    //           if (Math.abs(newPosition.y - p.positions[0].y) === 2) {
    //             return { ...updatedPiece, tunnelingUsed: true };
    //           }
    //           // En passant capture (would need additional logic)
    //           // Promotion (would need additional logic)
    //           return updatedPiece;

    //         // --- King Logic ---
    //         case p.type.startsWith("King"):
    //           // Castling (king side)
    //           if (newPosition.x - p.positions[0].x === 2) {
    //             // Find and move rook
    //             const rook = state.pieces.find(
    //               (piece) =>
    //                 piece.positions[0].x === 7 &&
    //                 piece.positions[0].y === newPosition.y
    //             );
    //             if (rook) {
    //               rook.positions[0] = { x: 5, y: newPosition.y };
    //             }
    //           }
    //           // Castling (queen side)
    //           if (newPosition.x - p.positions[0].x === -2) {
    //             const rook = state.pieces.find(
    //               (piece) =>
    //                 piece.positions[0].x === 0 &&
    //                 piece.positions[0].y === newPosition.y
    //             );
    //             if (rook) {
    //               rook.positions[0] = { x: 3, y: newPosition.y };
    //             }
    //           }
    //           return { ...updatedPiece, hasMoved: true };

    //         // --- Rook Logic ---
    //         case p.type.startsWith("Rook"):
    //           return { ...updatedPiece, hasMoved: true };

    //         // --- Knight Logic ---
    //         case p.type.startsWith("Knight"):
    //           // No special flags needed
    //           return updatedPiece;

    //         // --- Bishop Logic ---
    //         case p.type.startsWith("Bishop"):
    //           // No special flags
    //           return updatedPiece;

    //         // --- Queen Logic ---
    //         case p.type.startsWith("Queen"):
    //           // No special flags
    //           return updatedPiece;

    //         default:
    //           return updatedPiece;
    //       }
    //     }
    //     return p;
    //   });

    //   // Determine capture using entanglement rules
    //   const movedPiece = pieces.find((p) => p.id === pieceId)!;
    //   const capturePosition = movedPiece.positions[0];

    //   // 3. Remove any enemy piece occupying the target grid.
    //   //    Also keep the existing entanglement capture logic for allied pieces if needed.
    //   const filteredPieces = pieces.filter((p) => {
    //     // Always keep the piece that just moved.
    //     if (p.id === pieceId) return true;

    //     // Check if any piece is located on the target grid.
    //     if (
    //       p.positions.some(
    //         (pos) => pos.x === capturePosition.x && pos.y === capturePosition.y
    //       )
    //     ) {
    //       // If it’s an enemy piece, remove it (i.e. capture it).
    //       if (p.color !== movedPiece.color) {
    //         return false;
    //       }
    //       // Otherwise, if it is the same color, apply your entanglement logic.
    //       return (
    //         !p.entangledWith || !pieces.find((p2) => p2.id === p.entangledWith)
    //       );
    //     }
    //     return true;
    //   });

    //   const newBoardState = new Map(state.boardState);
    //   const targetKey = `${capturePosition.x}-${capturePosition.y}`;
    //   const pieceAtTarget = newBoardState.get(targetKey);
    //   if (pieceAtTarget && pieceAtTarget.color !== movedPiece.color) {
    //     newBoardState.delete(targetKey);
    //   }
    //   // Remove any old key for the moving piece (if it exists elsewhere)
    //   newBoardState.forEach((piece, key) => {
    //     if (piece.id === pieceId && key !== targetKey) {
    //       newBoardState.delete(key);
    //     }
    //   });
    //   newBoardState.set(targetKey, movedPiece);

    //   return {
    //     pieces: filteredPieces,
    //     currentPlayer: state.currentPlayer === "white" ? "black" : "white",
    //     boardState: newBoardState,
    //   };
    // });
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

  // isValidMove: (piece, target) => {
  //   const classicalMoves = getClassicalMoves(piece);
  //   return classicalMoves.some((m) => m.x === target.x && m.y === target.y);
  // },

  handlePieceClick: (piece: Piece) => {
    console.log("currrent p " + piece.type);
    const previous = get().selectedPiece;
    let moves: Position[];
    if (
      previous &&
      previous.color === get().currentPlayer &&
      piece.color !== get().currentPlayer
    ) {
      console.log("check mate+++++");
      moves = getAllAvailableMoves(previous, get().boardState);
    }
    moves = getAllAvailableMoves(piece, get().boardState);
    // making move
    if (
      moves.some(
        (mv) =>
          mv.x == previous?.positions[0].x && mv.y == previous?.positions[0].y
      ) &&
      previous?.color !== piece.color
    ) {
      console.log("+++++++++++++++");
      get().makeMove(piece.positions[0], get().validMoves);
    } else
      set((state) => ({
        ...state.quantumState,
        selectedPiece: piece,
        validMoves: moves,
      }));
  },

  makeMove: (pos: Position, validMoves: Position[]) => {
    console.log("making move ++++++++++++++++++++++++");
    if (get().currentPlayer !== get().selectedPiece?.color) return;
    const piece = get().boardState.get(pos.x + "-" + pos.y);
    if (piece && piece.color === get().currentPlayer) return;
    const selected = get().selectedPiece;
    if (!selected) return;
    else {
      if (validMoves.some((mv) => mv.x == pos.x && mv.y == pos.y)) {
        get().movePiece(selected, pos);
        const newMap = new Map(get().boardState);
        newMap.delete(`${selected.positions[0].x}-${selected.positions[0].y}`);
        newMap.set(`${pos.x}-${pos.y}`, get().selectedPiece!);
        set((state) => ({ ...state, boardState: newMap, validMoves: [] }));
      }
    }
  },
}));

export default useGameStore;
