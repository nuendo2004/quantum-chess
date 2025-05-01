import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/authOption";

const prisma = new PrismaClient();

export async function PUT(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const {
    quantumChessWins,
    puzzlesSolved,
    achievementsUnlocked,
    currentRank,
    xp,
    quantumChessSkillsProgress,
    puzzleSolvingProgress,
    learningProgress,
    quantumChessTotalGames,
    quantumChessCurrentStreak,
    puzzleAverageTimeSeconds,
    puzzlePerfectSolutions,
    inGameToken,
  } = body;

  const user = await prisma.user.findUnique({
    where: { email: session.user.email! },
    select: { id: true },
  });
  if (!user) {
    return NextResponse.json({ message: "User not found" }, { status: 404 });
  }

  const updated = await prisma.gameProfile.update({
    where: { userId: user.id },
    data: {
      quantumChessWins: quantumChessWins ?? undefined,
      puzzlesSolved: puzzlesSolved ?? undefined,
      achievementsUnlocked: achievementsUnlocked ?? undefined,
      currentRank: currentRank ?? undefined,
      xp: xp ?? undefined,
      quantumChessSkillsProgress: quantumChessSkillsProgress ?? undefined,
      puzzleSolvingProgress: puzzleSolvingProgress ?? undefined,
      learningProgress: learningProgress ?? undefined,
      quantumChessTotalGames: quantumChessTotalGames ?? undefined,
      quantumChessCurrentStreak: quantumChessCurrentStreak ?? undefined,
      puzzleAverageTimeSeconds: puzzleAverageTimeSeconds ?? undefined,
      puzzlePerfectSolutions: puzzlePerfectSolutions ?? undefined,
      inGameToken: inGameToken ?? undefined,
    },
  });

  return NextResponse.json({ gameProfile: updated });
}
