import dbConnect from "@/libs/dbConnect";
import User from "@/model/User";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
  try {
    const {
      name,
      email,
      password,
      emailVerified,
      image,
      accounts,
      sessions,
      dateCreated,
    } = await request.json();

    if (!email || !password) {
      return new Response(JSON.stringify({ message: "Missing fields" }), {
        status: 400,
      });
    }

    await dbConnect();

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return new Response(JSON.stringify({ message: "User already exists" }), {
        status: 400,
      });
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const newUser = new User({
      email,
      password: hashedPassword,
      name,
      emailVerified,
      image,
      accounts,
      sessions,
      dateCreated,
    });
    await newUser.save();

    return new Response(
      JSON.stringify({ message: "User created successfully" }),
      { status: 201 }
    );
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ message: "Server error" }), {
      status: 500,
    });
  }
}
