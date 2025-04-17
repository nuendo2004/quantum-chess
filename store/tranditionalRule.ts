import { Piece } from "./gamesStore";

const getAllAvailableMoves = (piece: Piece, boardState: Map<string, Piece>) => {
  const pos: Array<{ x: number; y: number }> = [];
  const currentX = piece.position.x;
  const currentY = piece.position.y;

  if (piece.type.startsWith("Pawn")) {
    const forwardYDelta = piece.color === "white" ? 1 : -1;

    // --- 1. Forward Move ---
    const forwardX = currentX;
    const forwardY = currentY + forwardYDelta;

    if (forwardX >= 0 && forwardX < 8 && forwardY >= 0 && forwardY < 8) {
      // Pawns can only move forward if the square is empty
      const forwardKey = `${forwardX}-${forwardY}`;
      if (!boardState.has(forwardKey)) {
        pos.push({ x: forwardX, y: forwardY });

        // --- 1a. Initial Double Move (Add this if the forward square is clear) ---
        const isStartingRow =
          (piece.color === "white" && currentY === 1) ||
          (piece.color === "black" && currentY === 6);

        if (isStartingRow) {
          const doubleForwardY = currentY + 2 * forwardYDelta;
          const doubleForwardKey = `${forwardX}-${doubleForwardY}`;
          // Can only move two squares if the intervening square AND the destination square are empty
          if (!boardState.has(doubleForwardKey)) {
            pos.push({ x: forwardX, y: doubleForwardY });
          }
        }
      }
    }

    // --- 2. Diagonal Captures ---
    const captureXOffsets = [-1, 1]; // Check left diagonal and right diagonal

    for (const xOffset of captureXOffsets) {
      const captureX = currentX + xOffset;
      const captureY = currentY + forwardYDelta; // Same Y direction as forward move

      // Check if the potential capture square is within bounds
      if (captureX >= 0 && captureX < 8 && captureY >= 0 && captureY < 8) {
        const captureKey = `${captureX}-${captureY}`;
        // Check if there's a piece on the target square
        if (boardState.has(captureKey)) {
          const occupyingPiece = boardState.get(captureKey);
          // Check if the piece belongs to the opponent
          // Make sure occupyingPiece is not undefined before accessing its color
          if (occupyingPiece && occupyingPiece.color !== piece.color) {
            // Valid capture! Add to possible moves.
            pos.push({ x: captureX, y: captureY });
          }
        }
      }
    }
  } else if (piece.type.startsWith("Rook")) {
    // Define the four directions (Up, Down, Left, Right)
    const directions = [
      { dx: 0, dy: 1 }, // Up
      { dx: 0, dy: -1 }, // Down
      { dx: -1, dy: 0 }, // Left
      { dx: 1, dy: 0 }, // Right
    ];

    // Iterate through each direction
    for (const dir of directions) {
      // Check squares incrementally in the current direction
      for (let i = 1; ; i++) {
        // Start one step away (i=1) and continue indefinitely until stopped
        const newX = currentX + i * dir.dx;
        const newY = currentY + i * dir.dy;

        // 1. Check if the new position is within board bounds
        if (newX < 0 || newX >= 8 || newY < 0 || newY >= 8) {
          break; // Out of bounds, stop checking in this direction
        }

        const squareKey = `${newX}-${newY}`;

        // 2. Check if the square is occupied
        if (boardState.has(squareKey)) {
          const occupyingPiece = boardState.get(squareKey);

          // 3. Check if the occupying piece is an enemy
          if (occupyingPiece && occupyingPiece.color !== piece.color) {
            pos.push({ x: newX, y: newY }); // Add capture move
          }
          // Whether it was an enemy (capture) or friendly (blocked),
          // the rook cannot move further in this direction.
          break; // Stop checking in this direction
        } else {
          // 4. The square is empty, it's a valid move.
          pos.push({ x: newX, y: newY });
          // Continue checking the next square in this direction (loop continues)
        }
      } // End loop for checking squares in one direction
    } // End loop for all directions
  } else if (piece.type.startsWith("Knight")) {
    // Define all 8 possible L-shaped moves for a knight
    const knightMoves = [
      { dx: 1, dy: 2 },
      { dx: 1, dy: -2 }, // One step right, two steps vert
      { dx: -1, dy: 2 },
      { dx: -1, dy: -2 }, // One step left, two steps vert
      { dx: 2, dy: 1 },
      { dx: 2, dy: -1 }, // Two steps right, one step vert
      { dx: -2, dy: 1 },
      { dx: -2, dy: -1 }, // Two steps left, one step vert
    ];

    // Iterate through each potential knight move
    for (const move of knightMoves) {
      const newX = currentX + move.dx;
      const newY = currentY + move.dy;

      // 1. Check if the potential move is within the board bounds
      if (newX >= 0 && newX < 8 && newY >= 0 && newY < 8) {
        const squareKey = `${newX}-${newY}`;

        // 2. Check if the destination square is occupied
        if (boardState.has(squareKey)) {
          const occupyingPiece = boardState.get(squareKey);

          // 3. Check if the occupying piece is an enemy (can capture)
          if (occupyingPiece && occupyingPiece.color !== piece.color) {
            pos.push({ x: newX, y: newY }); // Add capture move
          }
          // If the occupying piece is friendly, the move is blocked, so do nothing.
        } else {
          // 4. The square is empty, it's a valid move.
          pos.push({ x: newX, y: newY });
        }
      }
    }
  }

  // --- BISHOP LOGIC ---
  else if (piece.type.startsWith("Bishop")) {
    const directions = [
      { dx: 1, dy: 1 },
      { dx: 1, dy: -1 },
      { dx: -1, dy: 1 },
      { dx: -1, dy: -1 },
    ]; // Diagonals
    for (const dir of directions) {
      for (let i = 1; ; i++) {
        const newX = currentX + i * dir.dx;
        const newY = currentY + i * dir.dy;
        if (newX < 0 || newX >= 8 || newY < 0 || newY >= 8) break; // Out of bounds
        const squareKey = `${newX}-${newY}`;
        if (boardState.has(squareKey)) {
          const occupyingPiece = boardState.get(squareKey);
          if (occupyingPiece && occupyingPiece.color !== piece.color) {
            pos.push({ x: newX, y: newY }); // Capture enemy
          }
          break; // Path blocked
        } else {
          pos.push({ x: newX, y: newY }); // Empty square
        }
      }
    }
  }

  // --- QUEEN LOGIC ---
  else if (piece.type.startsWith("queen")) {
    // Combine Rook and Bishop directions
    const directions = [
      { dx: 0, dy: 1 },
      { dx: 0, dy: -1 },
      { dx: -1, dy: 0 },
      { dx: 1, dy: 0 }, // Rook moves
      { dx: 1, dy: 1 },
      { dx: 1, dy: -1 },
      { dx: -1, dy: 1 },
      { dx: -1, dy: -1 }, // Bishop moves
    ];
    for (const dir of directions) {
      for (let i = 1; ; i++) {
        const newX = currentX + i * dir.dx;
        const newY = currentY + i * dir.dy;
        if (newX < 0 || newX >= 8 || newY < 0 || newY >= 8) break; // Out of bounds
        const squareKey = `${newX}-${newY}`;
        if (boardState.has(squareKey)) {
          const occupyingPiece = boardState.get(squareKey);
          if (occupyingPiece && occupyingPiece.color !== piece.color) {
            pos.push({ x: newX, y: newY }); // Capture enemy
          }
          break; // Path blocked
        } else {
          pos.push({ x: newX, y: newY }); // Empty square
        }
      }
    }
  }

  // --- KING LOGIC ---
  else if (piece.type.startsWith("King")) {
    // Check all 8 adjacent squares (like Queen, but only 1 step)
    const kingMoves = [
      { dx: 0, dy: 1 },
      { dx: 0, dy: -1 },
      { dx: -1, dy: 0 },
      { dx: 1, dy: 0 }, // Cardinal
      { dx: 1, dy: 1 },
      { dx: 1, dy: -1 },
      { dx: -1, dy: 1 },
      { dx: -1, dy: -1 }, // Diagonal
    ];
    for (const move of kingMoves) {
      const newX = currentX + move.dx;
      const newY = currentY + move.dy;
      if (newX >= 0 && newX < 8 && newY >= 0 && newY < 8) {
        // Check bounds
        const squareKey = `${newX}-${newY}`;
        if (boardState.has(squareKey)) {
          const occupyingPiece = boardState.get(squareKey);
          if (occupyingPiece && occupyingPiece.color !== piece.color) {
            pos.push({ x: newX, y: newY }); // Capture enemy
          }
          // Cannot move onto friendly piece
        } else {
          pos.push({ x: newX, y: newY }); // Empty square
        }
      }
    }
  }

  return pos;
};
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

export { getAllAvailableMoves, aiPieceMap };
export type { AiPieceCode };
