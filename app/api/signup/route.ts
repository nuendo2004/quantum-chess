import { prisma } from "../auth/[...nextauth]/authOption";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { name, email, password } = await req.json();

  if (!email || !password || !name) {
    return NextResponse.json(
      { ok: false, message: "Missing fields" },
      { status: 400 }
    );
  }

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return NextResponse.json(
      { ok: false, message: "Email already in use" },
      { status: 400 }
    );
  }

  const hashed = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      email,
      name,
      password: hashed,
      dateCreated: new Date().toISOString(),
    },
  });

  await prisma.gameProfile.create({ data: { userId: user.id } });

  return NextResponse.json({ ok: true }, { status: 201 });
}
