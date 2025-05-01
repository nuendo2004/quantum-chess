"use client";

import { create } from "zustand";
// @ts-expect-error no type for chess engine
import { Game } from "js-chess-engine";
import InitialBoardState from "./initialPiecesState";
import {
  getGrid,
  getCoord,
  getCoordId,
  Coord,
  Grid,
} from "./ChessBoardMapping";
import {
  AiPieceCode,
  aiPieceMap,
  getAllAvailableMoves,
  playCaptureSound,
  playCheck,
  playCollapseSound,
  playEntanglementSound,
  playMoveSound,
  playSuperpositionSound,
} from "./tranditionalRule";

export type Position = { x: number; y: number };

export interface Piece {
  id: string;
  type: string;
  color: "white" | "black";
  position: Position;
  offside?: { x: number; y: number; z: number };
}

interface SuperPositionRecord {
  originalId: string;
  originalPos: Position;
  cloneId: string | null;
  clonePos: Position | null;
  captured: Piece[];
  timeLeft: number;
}
interface EntanglementRecord {
  allyId: string;
  allyPos: Position;
  enemyId: string;
  enemyPos: Position;
  turnsLeft: number;
}

type SuperPositions = Map<string, SuperPositionRecord>;
type Entanglements = Map<string, EntanglementRecord>;

interface GameState {
  gameOver: number;
  boardState: Map<string, Piece>;
  currentPlayer: "white" | "black";
  playerColor: "white" | "black";
  selectedPiece: Piece | null;
  validMoves: Position[];
  game: Game;
  gameScore: number;
  lastMove: { from: string; to: string } | null;
  message: string | null;
  superPositions: SuperPositions;
  entanglements: Entanglements;
  onSelectEntangle: boolean;
  playerQuantumEnergy: number;
  playerXP: number;
  winner: null | string;

  setMessage: (message: string | null) => void;
  handlePieceClick: (piece: Piece) => void;
  movePiece: (piece: Piece | null, dest: Position) => void;
  capturePiece: (taker: Piece, loser: Piece) => void;
  moveToGrid: (piece: Piece, dest: Position) => void;
  spawnPiece: (clone: Piece) => void;
  handleAiMove: () => void;
  initializeSuperposition: (piece: Piece) => void;
  collapsePiece: (piece: Piece) => void;
  tickSuperPositions: () => void;
  initializeEntanglement: (ally: Piece) => void;
  setGameOver: (n: number) => void;
  setWinner: (winner: string) => void;
  restartGame: () => void;
  tickEntanglements: () => void;
}

// ---------------------------------------------------------------------------
// Helper utilities
// ---------------------------------------------------------------------------
export const baseId = (id: string) => id.replace(/-copy$/, "");
export const isClone = (id: string) => id.endsWith("-copy");

const findCoordById = (
  board: Map<string, Piece>,
  pid: string
): [string, Piece] | null => {
  for (const [coord, pc] of board) if (pc.id === pid) return [coord, pc];
  return null;
};

const entKey = (id1: string, id2: string) => [id1, id2].sort().join("|");
// ---------------------------------------------------------------------------
// Main Zustand store
// ---------------------------------------------------------------------------

const initialState = {
  gameOver: -1, // -1: starting, 0: playing, 1: ending
  boardState: InitialBoardState,
  selectedPiece: null,
  validMoves: [],
  game: new Game(),
  gameScore: 0,
  lastMove: null,
  message: null,
  superPositions: new Map(),
  entanglements: new Map(),
  onSelectEntangle: false,
  playerQuantumEnergy: 100,
  playerXP: 0,
  winner: null,
};
const useGameStore = create<GameState>((set, get) => ({
  ...initialState,
  currentPlayer: "white",
  playerColor: "white",
  setGameOver: (state: number) => {
    set({ gameOver: state });
  },

  setWinner: (winner: string) => {
    set({
      winner,
      gameOver: 1,
    });
  },

  restartGame: () => {
    set({ ...initialState, currentPlayer: "white", playerColor: "white" });
  },

  setMessage: (message) => {
    set({ message });
  },
  /* ------------------------------ UI actions ------------------------------ */
  handlePieceClick: (piece) => {
    // handle entanglement selection
    const state = get();
    if (
      get().onSelectEntangle &&
      piece.color !== get().currentPlayer &&
      state.selectedPiece
    ) {
      if (
        state.superPositions.has(state.selectedPiece!.id) ||
        state.superPositions.has(piece.id)
      ) {
        set({
          message: "⛔ Cannot entangle pieces currently in super‑position.",
        });
        return;
      }
      const ent = new Map(state.entanglements);
      const key = entKey(state.selectedPiece.id, piece.id);
      if (ent.has(key)) return;
      ent.set(key, {
        allyId: state.selectedPiece.id,
        allyPos: state.selectedPiece.position,
        enemyId: piece.id,
        enemyPos: piece.position,
        turnsLeft: 5,
      });
      set({
        entanglements: ent,
        onSelectEntangle: false,
        message: `🔗 '${state.selectedPiece.id}' entangled with '${piece.id}' for 3 turns.`,
      });
      return;
    }

    // Ignore clicks during opponent's turn
    // if (get().currentPlayer !== get().playerColor) return;
    // Update valid moves
    const currentValidMoves = getAllAvailableMoves(piece, get().game);
    const prev = get().selectedPiece;

    if (
      prev &&
      piece.color !== get().playerColor &&
      piece.color !== prev?.color
    ) {
      get().movePiece(prev, piece.position);
      return;
    }

    set({ selectedPiece: piece, validMoves: currentValidMoves });
  },

  /* ----------------------------------------------------------------------- */
  /*                             Game Mechanics                              */
  /* ----------------------------------------------------------------------- */
  movePiece: (piece, dest) => {
    if (!piece) return;
    const state = get();

    const target = state.boardState.get(getCoordId(dest));

    if (state.currentPlayer === state.playerColor) {
      const validMoves = getAllAvailableMoves(piece, get().game);
      if (state.currentPlayer !== piece.color) return;
      if (
        !validMoves.some((mv: Position) => mv.x === dest.x && mv.y === dest.y)
      )
        return;
    }
    playMoveSound();
    // Handle capture
    if (target) {
      state.capturePiece(piece, target);
      return;
    }

    // If piece is in super‑position and hasn't split yet => spawn clone
    if (
      !isClone(piece.id) &&
      state.superPositions.has(piece.id) &&
      !state.superPositions.get(piece.id)!.cloneId
    ) {
      const clone: Piece = {
        ...piece,
        id: `${piece.id}-copy`,
        position: dest,
      };
      state.spawnPiece(clone);
      return;
    } else {
      // Simple classical move
      state.moveToGrid(piece, dest);
      // Update chess engine
      if (piece.color === state.playerColor) {
        state.game.move(
          getGrid(getCoordId(piece.position)),
          getGrid(getCoordId(dest))
        );
        set({ playerXP: get().playerXP + 10 });
      }
    }

    // Flip turn & process quantum timers
    set({ currentPlayer: state.currentPlayer === "white" ? "black" : "white" });
    get().tickSuperPositions();
    get().tickEntanglements();

    // Fire AI move if it's now AI's turn
    if (get().currentPlayer !== get().playerColor) {
      setTimeout(get().handleAiMove, Math.floor(Math.random() * 300));
    }
  },

  /* --------------------------- Chess‑engine AI ---------------------------- */
  handleAiMove: () => {
    const move = get().game.aiMove(1);
    const [[from, to]] = Object.entries<string>(move);
    set({
      lastMove: { from, to },
      playerQuantumEnergy: get().playerQuantumEnergy + 25,
    });
    // get().game.move(from, to);
    const startPiece = get().boardState.get(getCoord(from as Grid));
    if (!startPiece) return;

    setTimeout(() => {
      const destCoord = getCoord(to as Grid)
        .split("-")
        .map(Number);
      get().movePiece(startPiece, { x: destCoord[0], y: destCoord[1] });
      if (get().game.board.configuration.check) {
        playCheck();
        set({ message: "Check, your king is in danger!" });
      }
    }, Math.floor(Math.random() * 500) + 500);
  },

  /* -------------------------- Simple board move -------------------------- */
  moveToGrid: (piece, dest) => {
    const board = new Map(get().boardState);
    const validMoves = getAllAvailableMoves(piece, get().game);
    if (
      !validMoves.some((mv: Position) => mv.x === dest.x && mv.y === dest.y) &&
      get().currentPlayer === get().playerColor
    )
      return;
    // Remove from old square & add to new
    board.delete(getCoordId(piece.position));
    board.set(getCoordId(dest), { ...piece, position: dest });

    // Update quantum record if necessary
    const sup = new Map(get().superPositions);
    const rec = sup.get(baseId(piece.id));
    if (rec) {
      if (isClone(piece.id)) rec.clonePos = dest;
      else rec.originalPos = dest;
      sup.set(baseId(piece.id), rec);
    }

    set({ boardState: board, superPositions: sup, selectedPiece: null });
  },

  /* ------------------------ Super‑position utilities --------------------- */
  initializeSuperposition: (piece) => {
    playSuperpositionSound();
    const sup = new Map(get().superPositions);
    if (sup.has(piece.id)) return; // already quantum
    for (const er of get().entanglements.values()) {
      if (er.allyId === piece.id || er.enemyId === piece.id) {
        set({
          message: `⛔ Cannot put '${piece.id}' in super‑position while entangled.`,
        });
        return;
      }
    }

    sup.set(piece.id, {
      originalId: piece.id,
      originalPos: piece.position,
      cloneId: null,
      clonePos: null,
      captured: [],
      timeLeft: 10,
    });
    set({
      superPositions: sup,
      message: `Piece '${piece.id}' entered super‑position!`,
      playerQuantumEnergy: get().playerQuantumEnergy - 100,
    });
  },

  spawnPiece: (clone) => {
    const sup = new Map(get().superPositions);
    const rec = sup.get(baseId(clone.id));
    if (!rec) return;

    /* Place clone on board */
    const board = new Map(get().boardState);
    board.set(getCoordId(clone.position), clone);

    /* Update chess engine */
    get().game.setPiece(
      getGrid(getCoordId(clone.position)),
      aiPieceMap[clone.id.substring(0, 2) as AiPieceCode]
    );

    rec.cloneId = clone.id;
    rec.clonePos = clone.position;
    sup.set(baseId(clone.id), rec);
    set({
      boardState: board,
      superPositions: sup,
      message: `🌀 Clone of '${baseId(clone.id)}' spawned.`,
    });
  },

  /* ----------------------------- Capture logic --------------------------- */
  capturePiece: (taker, loser) => {
    const board = new Map(get().boardState);
    const sup = new Map(get().superPositions);
    const game = get().game;
    const ent = new Map(get().entanglements);
    // ---- Quantum capture ----
    if (sup.has(baseId(loser.id))) {
      const rec = sup.get(baseId(loser.id))!;
      const rootId = baseId(loser.id);

      // Remove the captured branch (always dies)
      const gone = findCoordById(board, loser.id);
      if (gone) {
        board.delete(gone[0]);
        game.removePiece(getGrid(gone[0] as Coord));
      }

      // Move taker to that square
      board.delete(getCoordId(taker.position));
      const moved: Piece = { ...taker, position: loser.position };
      board.set(getCoordId(moved.position), moved);

      // Update taker's quantum record if any
      const takerRec = sup.get(baseId(taker.id));
      if (takerRec) {
        // eslint-disable-next-line @typescript-eslint/no-unused-expressions
        isClone(taker.id)
          ? (takerRec.clonePos = moved.position)
          : (takerRec.originalPos = moved.position);
        sup.set(baseId(taker.id), takerRec);
      }

      // Optional 50‑50 chance the other branch also dies
      const otherId = [rec.originalId, rec.cloneId].filter(
        (id) => id !== loser.id
      )[0];
      let bothGone = false;
      if (otherId && Math.random() < 0.5) {
        const other = findCoordById(board, otherId);
        if (other) {
          board.delete(other[0]);
          game.removePiece(getGrid(other[0] as Coord));
          bothGone = true;
        }
      }

      // Clean record & message
      sup.delete(rootId);
      const captureMsg = bothGone
        ? `☠️ Both branches of '${rootId}' were destroyed during capture!`
        : `⚖️ Quantum capture resolved – '${rootId}' collapsed to a single branch.`;

      if (taker.color === get().playerColor) {
        game.move(
          getGrid(getCoordId(taker.position)),
          getGrid(getCoordId(moved.position))
        );
      }

      set({
        boardState: board,
        superPositions: sup,
        selectedPiece: null,
        currentPlayer: get().currentPlayer === "white" ? "black" : "white",
        gameScore:
          get().gameScore + get().currentPlayer === get().playerColor ? 100 : 0,
        playerXP:
          get().playerXP + get().currentPlayer === get().playerColor ? 100 : 0,
        message: captureMsg,
      });
      get().tickSuperPositions();

      // Trigger AI if needed
      if (get().currentPlayer !== get().playerColor) {
        setTimeout(get().handleAiMove, Math.floor(Math.random() * 300) + 500);
      }
      return;
    }
    const resolveEntanglement = (capturedId: string) => {
      for (const [key, rec] of ent) {
        if (rec.allyId === capturedId || rec.enemyId === capturedId) {
          const partnerId =
            rec.allyId === capturedId ? rec.enemyId : rec.allyId;
          const partner = findCoordById(board, partnerId);
          if (partner) {
            board.delete(partner[0]);
            game.removePiece(getGrid(partner[0] as Coord));
          }
          ent.delete(key);
          return partnerId;
        }
      }
      return null;
    };

    // ---- Classical capture ----
    board.delete(getCoordId(loser.position));
    if (get().currentPlayer === get().playerColor) {
      game.removePiece(getGrid(getCoordId(loser.position)));
    }
    board.delete(getCoordId(taker.position));
    const moved: Piece = { ...taker, position: loser.position };
    board.set(getCoordId(moved.position), moved);

    // quantum bookkeeping for taker
    const qRec = sup.get(baseId(taker.id));
    if (qRec) {
      if (isClone(taker.id)) qRec.clonePos = moved.position;
      else qRec.originalPos = moved.position;
      sup.set(baseId(taker.id), qRec);
    }

    const partnerId = resolveEntanglement(loser.id);
    const captureMsg = partnerId
      ? `🔗 Entangled capture: '${loser.id}' & '${partnerId}' removed.`
      : `❌ ${loser.type} captured by ${taker.type}.`;

    const rec = sup.get(baseId(taker.id));
    if (rec) {
      rec.captured.push(loser);
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      isClone(taker.id)
        ? (rec.clonePos = moved.position)
        : (rec.originalPos = moved.position);
      sup.set(baseId(taker.id), rec);
    }
    playCaptureSound();
    if (taker.color === get().playerColor) {
      game.move(
        getGrid(getCoordId(taker.position)),
        getGrid(getCoordId(moved.position))
      );
    }

    set({
      boardState: board,
      superPositions: sup,
      selectedPiece: null,
      entanglements: ent,
      currentPlayer: get().currentPlayer === "white" ? "black" : "white",
      message: captureMsg,
    });

    get().tickSuperPositions();
    if (get().currentPlayer !== get().playerColor) {
      setTimeout(get().handleAiMove, Math.floor(Math.random() * 300));
    }
  },

  /* -----------------------  Quantum‑timer housekeeping  ---------------------- */
  tickSuperPositions: () => {
    const board = new Map(get().boardState);
    const sup = new Map(get().superPositions);
    const game = get().game;

    const notices: string[] = [];

    for (const [rootId, rec] of sup) {
      // warn 1 turn before collapse
      if (rec.timeLeft === 1) {
        notices.push(`⚠️  '${rootId}' will collapse on the next turn!`);
      }

      rec.timeLeft -= 1;
      if (rec.timeLeft > 0) {
        sup.set(rootId, rec);
        continue; // still quantum → skip collapse logic
      }

      // nothing to collapse (no clone ever spawned) → just reset
      if (!rec.cloneId) {
        sup.delete(rootId);
        notices.push(
          `🔄  '${rootId}' returned to classical (no clone spawned).`
        );
        continue;
      }

      // choose the survivor
      const ids = [rec.originalId, rec.cloneId] as string[];
      const keepIdx = Math.floor(Math.random() * ids.length);
      const keepId = ids[keepIdx];

      ids.forEach((id) => {
        if (id === keepId) return;
        const gone = findCoordById(board, id);
        if (gone) {
          board.delete(gone[0]);
          game.removePiece(getGrid(gone[0] as Coord));
        }
      });

      sup.delete(rootId);
      notices.push(`💥  Collapse resolved – branch '${keepId}' survived.`);
    }

    if (notices.length) {
      set({
        boardState: board,
        superPositions: sup,
        message: notices.join(" | "),
      });
    } else {
      // don’t overwrite an existing message if nothing new happened
      set({ boardState: board, superPositions: sup });
    }
  },

  /* ------------------  Forced collapse after a capture  ---------------------- */
  collapsePiece: (piece) => {
    const board = new Map(get().boardState);
    const sup = new Map(get().superPositions);
    const game = get().game;

    const rootId = baseId(piece.id);
    const rec = sup.get(rootId);
    if (!rec) return;
    playCollapseSound();
    const branches = [rec.originalId, rec.cloneId].filter(Boolean) as string[];
    const killId = branches[Math.floor(Math.random() * branches.length)];

    const gone = findCoordById(board, killId);
    if (gone) {
      board.delete(gone[0]);
      game.removePiece(getGrid(gone[0] as Coord));
    }

    sup.delete(rootId);

    const msg =
      branches.length === 1
        ? `💀  '${rootId}' had no surviving branches (removed from board).`
        : `💥  Collapse: branch '${killId}' lost – '${rootId}' now classical.`;

    set({ boardState: board, superPositions: sup, message: msg });
  },

  tickEntanglements: () => {
    const ent = new Map(get().entanglements);
    const msgs: string[] = [];
    for (const [key, r] of ent) {
      if (r.turnsLeft === 1)
        msgs.push(
          `⚠️ Entanglement '${r.allyId}'↔'${r.enemyId}' expires next turn.`
        );
      r.turnsLeft -= 1;
      if (r.turnsLeft <= 0) {
        ent.delete(key);
        msgs.push(`⏳ Entanglement '${r.allyId}'↔'${r.enemyId}' expired.`);
      } else ent.set(key, r);
    }
    if (msgs.length) set({ entanglements: ent, message: msgs.join(" | ") });
    else set({ entanglements: ent });
  },

  initializeEntanglement: () => {
    playEntanglementSound();
    set({
      onSelectEntangle: true,
      playerQuantumEnergy: get().playerQuantumEnergy - 100,
    });
  },
}));

export default useGameStore;
