// app/api/auth/[...nextauth]/route.js
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { PrismaClient } from "@prisma/client";
import dbConnect from "@/libs/dbConnect";
import User from "@/model/User";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const client_id = process.env.GOOGLE_CLIENT_ID;
const client_secret = process.env.GOOGLE_CLIENT_SECRET;

if (!client_id || !client_secret) {
  throw Error("Missing google env variables.");
}

const handler = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: client_id,
      clientSecret: client_secret,

      profile(profile) {
        console.log(profile);
        return {
          id: profile.sub,
          name: profile.name,
          email: profile.email,
          emailVerified: profile.email_verified ? new Date() : null,
          image: profile.picture,
          dateCreated: new Date().toUTCString(),
        };
      },
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: {
          label: "Email",
          type: "email",
          placeholder: "you@example.com",
        },
        password: { label: "Password", type: "password" },
        name: { label: "Name", type: "Name" },
        emailVerified: { label: "Password", type: "password" },
        image: { label: "Password", type: "password" },
        dateCreated: { label: "Password", type: "password" },
      },
      //@ts-expect-error nothing serious
      async authorize(credentials) {
        if (!credentials) {
          throw new Error("Invalid user info");
        }
        try {
          await dbConnect();
          const user = await User.findOne({ email: credentials.email });

          if (!user) {
            return null;
          }

          if (!user.password) {
            return null;
          }
          console.log(user.password, credentials?.password);
          const isValid = await bcrypt.compare(
            credentials.password,
            user.password
          );
          if (!isValid) {
            return null;
          }

          return {
            id: user._id.toString(),
            email: user.email,
          };
        } catch (error) {
          console.error("Authorization error:", error);
          return null;
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, account, user }) {
      if (account && user) {
        token.accessToken = account.access_token;
      }
      return token;
    },
    async session({ session, token }) {
      //@ts-expect-error unknown
      session.accessToken = token.accessToken;
      return session;
    },
    async redirect({ url, baseUrl }) {
      return url.startsWith(baseUrl) ? url : `${baseUrl}/`;
    },
  },
  pages: {
    signIn: "/signin",
  },
});

export { handler as GET, handler as POST };
