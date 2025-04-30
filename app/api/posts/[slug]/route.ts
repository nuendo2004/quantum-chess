// app/api/posts/[slug]/route.ts
import { NextResponse } from "next/server";
import { authOptions, prisma } from "../../auth/[...nextauth]/authOption";
import { getServerSession } from "next-auth";

async function rewardDailyLogin(userId: string) {
  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);

  await prisma.gameProfile.update({
    where: { userId },
    data: {
      inGameToken: { increment: 50 },
    },
  });
}

export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  const session = await getServerSession(authOptions);
  if (session?.user?.id) {
    await rewardDailyLogin(session.user.id);
  }

  const { slug } = params;
  try {
    const post = await prisma.blogPost.findUnique({
      where: { slug },
    });
    if (!post) {
      return NextResponse.json({ message: "Post not found" }, { status: 404 });
    }
    return NextResponse.json(post, { status: 200 });
  } catch (error) {
    console.error(`Error fetching post ${slug}:`, error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
