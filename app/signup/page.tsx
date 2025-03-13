"use client";

import GoogleSVG from "@/svg/GoogleSVG";
import { User } from "@prisma/client";
import { randomUUID } from "crypto";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

const SignUp = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [name, setName] = useState("");
  const [image, setImage] = useState("");

  const router = useRouter();

  const handleSignup = async () => {
    const uploadUser: User = {
      id: randomUUID(),
      name,
      email,
      password,
      emailVerified: null,
      image,
      dateCreated: new Date().toUTCString(),
    };
    if (image) {
      uploadUser.image = image;
      uploadUser.dateCreated = new Date().toUTCString();
    }

    const res = await fetch("/api/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(uploadUser),
    });
    const data = await res.json();
    if (res.ok) {
      router.push("/signin"); // Redirect to sign in page after successful signup
    } else {
      setMessage(data.message);
    }
  };

  const handleGoogleSignUp = async () => {
    await signIn("google", { callbackUrl: "/home" });
  };

  return (
    <div className="fixed inset-0 bg-neutral-500 bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-800 mb-3">
            Create your account
          </h2>
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="text-black w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-gray-700 mb-2">
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="text-neutral-500 w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label htmlFor="name" className="block text-gray-700 mb-2">
                Name
              </label>
              <input
                type="name"
                id="name"
                value={name.split(" ")[0]}
                onChange={(e) => setName(e.target.value)}
                className="text-black w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label htmlFor="image" className="block text-gray-700 mb-2">
                Image
              </label>
              <input
                type="image"
                id="image"
                value={image}
                onChange={(e) => setImage(e.target.value)}
                className="text-black w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <button
              data-testid="signup-button"
              type="submit"
              className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors"
              onClick={handleSignup}
            >
              Sign Up
            </button>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">
                  Or continue with
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleGoogleSignUp}
              className="w-full flex items-center justify-center gap-2 py-2 px-4 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
            >
              <GoogleSVG />
              <span className="text-gray-700">Continue with Google</span>
            </button>
            {message && <p className="text-red-500">{message}</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
