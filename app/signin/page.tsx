"use client";
import GoogleSVG from "@/svg/GoogleSVG";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const router = useRouter();

  const handleGoogleSignUp = async () => {
    await signIn("google", { callbackUrl: "/home" });
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await signIn("credentials", {
      redirect: true,
      email,
      password,
    });
    if (result?.error) {
      console.log(result);
      setMessage(result.error);
    } else {
      router.push("/home");
    }
  };

  const handleSignUpRedirect = () => {
    router.push("/signup");
  };

  return (
    <div className="fixed inset-0 bg-neutral-500 bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-800 mb-3">Login</h2>
          <div onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-gray-700 mb-2" htmlFor="email">
                Email
              </label>
              <input
                type="text"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="text-black w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 mb-2" htmlFor="password">
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

            <button
              type="submit"
              className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors"
              onClick={handleLogin}
            >
              Login
            </button>
            <p className="text-neutral-600">
              Don&apos;t post have an account? click{" "}
              <a
                className="text-blue-700 font-bold cursor-pointer"
                onClick={handleSignUpRedirect}
              >
                Here
              </a>
            </p>
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
            {message && <p>{message}</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
