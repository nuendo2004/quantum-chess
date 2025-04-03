import { create } from "zustand";
import { getAllAvailableMoves } from "./tranditionalRule";
import InitialBoardState from "./initialPiecesState";
//@ts-expect-error no type for chess
import { Game, move, status, moves, aiMove, getFen } from 'js-chess-engine'
import { getBoardName, getGridName } from "./ChessBoardMapping";

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
  game: Game
  boardState: Map<string, Piece>;
  playerColor: "white" | "black";
  currentPlayer: "white" | "black";
  quantumState: QuantumState;
  selectedPiece: Piece | null;
  validMoves: Position[];
  moves: { pieceId: string; positions: Position }[];
  setSuperposition: (piece: Piece, positions: Position[]) => void;
  entanglePieces: (piece1: Piece, piece2: Piece) => void;
  movePiece: (piece: Piece, newPosition: Position) => void;
  collapseSuperposition: (piece: Piece, triggerPosition: Position) => void;
  setQuantumMoveType: (moveType: QuantumState["activeMoveType"]) => void;
  handlePieceClick: (piece: Piece) => void;
  makeMove: (pos: Position, newPosition: Position[]) => void;
}

const distance = (a: Position, b: Position) =>
  Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2);

const useGameStore = create<GameState>((set, get) => ({
  currentPlayer: "white",
  playerColor: "white",
  boardState: InitialBoardState,
  moves: [],
  quantumState: {
    activeMoveType: null,
    quantumTokens: { white: 3, black: 3 },
  },
  selectedPiece: null,
  validMoves: [],
  game: new Game(),

  // ========================================== Classic Moves ====================================================

  movePiece: (piece, newPosition) => {
    const targetId = `${newPosition.x}-${newPosition.y}`;
    const previousPosition = `${piece.positions[0].x}-${piece.positions[0].y}`;
    set((state) => {
      // Get the current board state and the target piece
      const currentBoardState = get().boardState;
      const targetPiece = currentBoardState.get(targetId);

      const newBoardState = new Map(currentBoardState);
      newBoardState.delete(previousPosition)
      if (targetPiece) {
        newBoardState.delete(targetId)
      }
      const updatedMovingPiece: Piece = { ...piece, positions: [newPosition] };
      newBoardState.set(targetId, updatedMovingPiece) 
      //@ts-expect-error no type for chess
      console.log(getBoardName(previousPosition), getBoardName(targetId))
      co
      state.game.move(getBoardName(previousPosition), getBoardName(targetId))
      return {
        ...state,
        boardState: newBoardState,
        currentPlayer: state.currentPlayer === "white" ? "black" : "white",
      };
    });
    if (get().currentPlayer !== get().playerColor) {
        console.log("ai making a move")
        const move = get().game.aiMove(1)
        console.log(move)
        const [[start, end]] = Object.entries(move);
        const startPiece = get().boardState.get(getGridName(start))
        if (!startPiece) {
          throw Error("AI is just dumb, and it made a mistake.")
        }
        const targetPos = getGridName(end)
        console.log(startPiece)
        console.log(end)
        get().movePiece(startPiece, 
          { x: Number(targetPos.split("-")[0]), y: Number(targetPos.split("-")[1])}
        )
    }

  },


  // isValidMove: (piece, target) => {
  //   const classicalMoves = getClassicalMoves(piece);
  //   return classicalMoves.some((m) => m.x === target.x && m.y === target.y);
  // },

  handlePieceClick: (piece: Piece) => {
    if (get().currentPlayer !== get().playerColor) return
    const previous = get().selectedPiece;
    const currentValidMoves = getAllAvailableMoves(piece, get().boardState)

    if (!previous || piece.color === get().currentPlayer) {
      set((state) => ({
        ...state.quantumState,
        selectedPiece: piece,
        validMoves: currentValidMoves,
      }))
      return
    }
    const previousValidMoves = getAllAvailableMoves(previous, get().boardState)
    if (previousValidMoves.some((mv) => mv.x === piece.positions[0].x && mv.y === piece.positions[0].y)) {
      get().movePiece(previous, piece.positions[0])
    }
    else {
      set((state) => ({
        ...state.quantumState,
        selectedPiece: piece,
        validMoves: currentValidMoves,
      }))
      return
    }

//     let moves: Position[];
//     else if (
//       previous &&
//       previous.color === get().currentPlayer &&
//       piece.color !== get().currentPlayer
//     ) {
//       moves = getAllAvailableMoves(previous, get().boardState);
//     }
//     moves = getAllAvailableMoves(piece, get().boardState);
//     // making move
//     else (
//       moves.some(
//         (mv) =>
//           mv.x == previous?.positions[0].x && mv.y == previous?.positions[0].y
//       ) &&
//       previous?.color !== piece.color
//     ) {
//       console.log("+++++++++++++++");
//       get().makeMove(piece.positions[0], get().validMoves);
//     }
// );
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

  setSuperposition: (piece: Piece, positions: Position[]) => {
    const state = get();
    if (!piece || piece.quantumMovesLeft <= 0) return;
    const newBoardState = new Map(state.boardState)
    newBoardState.set(`${piece.positions[0].x}-${piece.positions[0].y}`, {
      ...piece,
      positions,
      isSuperposed: true,
      quantumMovesLeft: piece.quantumMovesLeft - 1,
    })
    set({
      boardState: newBoardState,
      quantumState: {
        ...state.quantumState,
        quantumTokens: {
          ...state.quantumState.quantumTokens,
          //@ts-expect-error todo
          [piece.color]: state.quantumState.quantumTokens[piece.color] - 1,
        },
      },
    });
  },

  entanglePieces: (piece1: Piece, piece2: Piece) => {
    const state = get();
    if (!piece1 || !piece2 || piece1.color !== piece2.color) return;
    const newBoardState = new Map(state.boardState)
    newBoardState.set(`${piece1.positions[0].x}-${piece1.positions[0].y}`, piece1)
    newBoardState.set(`${piece2.positions[0].x}-${piece2.positions[0].y}`, piece2)
    set({boardState: newBoardState})
  },

  collapseSuperposition: (piece, triggerPosition) => {
    set((state) => {
      if (!piece?.isSuperposed || piece.type.startsWith("King")) return state;

      const collapsedPosition = piece.positions.reduce(
        (closest, pos) =>
          distance(pos, triggerPosition) < distance(closest, triggerPosition)
            ? pos
            : closest,
        piece.positions[0]
      );
      const newBoardState = new Map(state.boardState)
      newBoardState.set(`${piece.positions[0].x}-${piece.positions[0].y}`, {
        ...piece,
        positions: [collapsedPosition],
        isSuperposed: false,
      })
      return {
        boardState: newBoardState
      }
    });
  },

  setQuantumMoveType: (moveType) => {
    set((state) => ({
      quantumState: { ...state.quantumState, activeMoveType: moveType },
    }));
  },
}));

export default useGameStore;
