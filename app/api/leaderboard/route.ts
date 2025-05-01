import { NextRequest, NextResponse } from "next/server";
import { PrismaClient, Prisma } from "@prisma/client";

interface UserSelection {
  id: string;
  name: string | null;
  image: string | null;
}

interface LeaderboardEntryApi {
  rank: number;
  xp: number;
  user: UserSelection;
}

interface ApiResponse {
  entries: LeaderboardEntryApi[];
  totalCount: number;
  totalPages: number;
  currentPage: number;
}

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const pageQuery = searchParams.get("page") || "1";
  const pageSizeQuery = searchParams.get("pageSize") || "15"; // Default to 15

  let page = parseInt(pageQuery, 10);
  let pageSize = parseInt(pageSizeQuery, 10);

  if (isNaN(page) || page < 1) {
    page = 1;
  }
  if (isNaN(pageSize) || pageSize < 1) {
    pageSize = 15;
  }
  if (pageSize > 100) {
    pageSize = 100;
  }

  const skip = (page - 1) * pageSize;
  const take = pageSize;

  try {
    const [totalCount, gameProfiles] = await prisma.$transaction([
      prisma.gameProfile.count(),
      prisma.gameProfile.findMany({
        orderBy: { xp: "desc" },
        skip: skip,
        take: take,
        select: {
          xp: true,
          user: {
            select: {
              id: true,
              name: true,
              image: true,
            },
          },
        },
      }),
    ]);

    // Calculate Ranks
    const totalPages = Math.ceil(totalCount / pageSize);
    const rankedEntries: LeaderboardEntryApi[] = gameProfiles.map(
      (profile, index) => ({
        rank: skip + index + 1,
        xp: profile.xp,
        user: profile.user,
      })
    );

    const responseBody: ApiResponse = {
      entries: rankedEntries,
      totalCount: totalCount,
      totalPages: totalPages,
      currentPage: page,
    };
    return NextResponse.json(responseBody, { status: 200 });
  } catch (error) {
    console.error("API Error fetching leaderboard:", error);

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      return NextResponse.json(
        { message: "Database error occurred." },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
