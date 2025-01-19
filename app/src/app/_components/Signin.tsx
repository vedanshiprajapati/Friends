"use client";
import React, { useState, useTransition } from "react";
import { Lock, Mail, MoveLeft, Coffee } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { LoginSchema } from "@/schemas";
import { signin } from "@/app/_actions/signin";
import { signIn } from "next-auth/react";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validFields = LoginSchema.safeParse({ email, password });

    startTransition(() => {
      signin({ email, password }).then((data) => {
        if (data?.error) console.log("Errrorrrr", data.error);
      });
    });
  };

  const SigninWithGoogle = () => {
    signIn("google", { callbackUrl: DEFAULT_LOGIN_REDIRECT });
  };

  return (
    <div
      className="min-h-screen flex"
      style={{
        backgroundColor: "#F7EFE5",
        fontFamily: "'Arial', sans-serif",
      }}
    >
      {/* Left Side - Illustration Section */}
      <div
        className="w-1/2 flex items-center justify-center p-12"
        style={{ backgroundColor: "#C8A1E0" }}
      >
        <div className="text-center">
          <Coffee size={200} color="#674188" className="mx-auto mb-8" />
          <h2 className="text-4xl font-bold mb-4" style={{ color: "#674188" }}>
            Central Perk Awaits
          </h2>
          <p className="text-xl" style={{ color: "#674188" }}>
            Where friendship meets conversation
          </p>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div
        className="w-1/2 flex items-center justify-center p-12"
        style={{ backgroundColor: "#F7EFE5" }}
      >
        <div
          className="w-full max-w-md p-8 rounded-xl relative"
          style={{
            backgroundColor: "#E2BFD9",
            border: "4px solid #674188",
          }}
        >
          {/* Back button moved to top-left corner */}
          <Link href={"/"} className="absolute top-4 left-4">
            <MoveLeft
              className="border-deepPurple p-1 border-2 rounded-full transform hover:scale-110"
              color="#674188"
              strokeWidth={"3px"}
              size={25}
            />
          </Link>

          <h1
            className="text-3xl font-bold text-center mb-8"
            style={{ color: "#674188" }}
          >
            Welcome Back
          </h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="relative">
              <Mail
                className="absolute left-3 top-1/2 transform -translate-y-1/2"
                color="#674188"
              />
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full pl-10 pr-4 py-3 rounded-lg"
                style={{
                  backgroundColor: "#F7EFE5",
                  color: "#674188",
                  border: "2px solid #674188",
                }}
              />
            </div>

            <div className="relative">
              <Lock
                className="absolute left-3 top-1/2 transform -translate-y-1/2"
                color="#674188"
              />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full pl-10 pr-4 py-3 rounded-lg"
                style={{
                  backgroundColor: "#F7EFE5",
                  color: "#674188",
                  border: "2px solid #674188",
                }}
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-lg font-bold transition-all duration-300 hover:scale-105"
              style={{
                backgroundColor: "#674188",
                color: "#F7EFE5",
              }}
            >
              {isPending ? "Loading..." : "Sign In"}
            </button>
          </form>

          <div className="flex my-6 items-center">
            <div className="w-auto h-1 bg-[#674188] flex-grow rounded-full"></div>
            <div className="mx-2 text-[#674188]">or</div>
            <div className="w-auto h-1 bg-[#674188] flex-grow rounded-full"></div>
          </div>

          <button
            className="w-full py-3 rounded-lg font-bold transition-all duration-300 hover:scale-105 flex items-center justify-center"
            style={{
              backgroundColor: "#674188",
              color: "#F7EFE5",
            }}
            onClick={() => SigninWithGoogle()}
          >
            <p className="px-2">Sign in with </p>
            <Image
              src={"/googleLogo.png"}
              alt="google logo"
              height={30}
              width={30}
              className="p-1"
            />
          </button>

          <div className="text-center mt-4">
            <Link
              href="/forgot-password"
              className="text-sm"
              style={{ color: "#674188" }}
            >
              Forgot password? Could I BE any more helpful?
            </Link>
          </div>

          <div className="text-center mt-6">
            <p className="text-sm" style={{ color: "#674188" }}>
              Don't have an account?
              <Link
                href="/auth/signup"
                className="font-bold ml-2 hover:underline"
                style={{ color: "#674188" }}
              >
                Sign Up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
