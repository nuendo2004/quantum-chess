import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/authOption";
import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json(
      { message: "Unauthorized - No valid session or email found" },
      { status: 401 }
    );
  }

  const userEmail = session.user.email;

  try {
    const user = await prisma.user.findUnique({
      where: { email: userEmail },
      select: {
        id: true,
        name: true,
        email: true,
        emailVerified: true,
        image: true,
        dateCreated: true,
      },
    });

    if (!user) {
      console.error(
        `User with email ${userEmail} not found in Prisma DB despite valid session.`
      );
      return NextResponse.json(
        { message: "User not found in database" },
        { status: 404 }
      );
    }

    const gameProfile = await prisma.gameProfile.findUnique({
      where: { userId: user.id },
    });
    return NextResponse.json({ user, gameProfile });
  } catch (error) {
    console.error(`API Error fetching profile for email ${userEmail}:`, error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
