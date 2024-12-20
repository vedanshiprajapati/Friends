"use client";
import React, { useState, useTransition } from "react";
import { Lock, Mail, MoveLeft, User, Coffee, ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { signup } from "@/_actions/signup";
import { DEFAULT_LOGIN_REDIRECT } from "../../routes";
import { signIn } from "next-auth/react";

const SignupPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("signup attempted", { email, password, name });
    startTransition(() => {
      signup({ email, password, name }).then((data) => {
        if (data.error)
          console.log(
            "Errrorrr while signing up HandleSubmit function",
            data.error
          );
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
      {/* Left Side - Signup Form */}
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
            Join the Gang
          </h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="relative">
              <Mail
                className="absolute left-3 top-1/2 transform -translate-y-1/2"
                color="#674188"
              />
              <input
                type="email"
                placeholder="Email(Required)"
                value={email}
                disabled={isPending}
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
              <User
                className="absolute left-3 top-1/2 transform -translate-y-1/2"
                color="#674188"
              />
              <input
                type="text"
                placeholder="Name(Required)"
                value={name}
                required
                onChange={(e) => setName(e.target.value)}
                disabled={isPending}
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
                placeholder="Password(Required)"
                value={password}
                disabled={isPending}
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
              disabled={isPending}
              className="w-full py-3 rounded-lg font-bold transition-all duration-300 hover:scale-105"
              style={{
                backgroundColor: "#674188",
                color: "#F7EFE5",
              }}
            >
              {isPending ? "Loading..." : "Sign up"}
            </button>
          </form>
          <div className="flex items-center my-6">
            <div className="w-auto h-1 bg-[#674188] flex-grow rounded-full"></div>
            <div className="mx-4 text-[#674188]">OR</div>
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
            <p className="px-2">Sign up with </p>
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
              href={"/auth/signin"}
              className="text-sm flex items-center justify-center"
              style={{ color: "#674188" }}
            >
              Already part of the gang? Pivot to Sign In!
              <ArrowRight className="ml-2" />
            </Link>
          </div>
        </div>
      </div>

      {/* Right Side - Illustration Section */}
      <div
        className="w-1/2 flex items-center justify-center p-12"
        style={{ backgroundColor: "#C8A1E0" }}
      >
        <div className="text-center">
          <div className="flex justify-center mb-8">
            <div
              className="w-48 h-48 rounded-full flex items-center justify-center"
              style={{
                backgroundColor: "#F7EFE5",
                border: "4px solid #674188",
              }}
            >
              <Coffee size={120} color="#674188" />
            </div>
          </div>
          <h2 className="text-4xl font-bold mb-4" style={{ color: "#674188" }}>
            Welcome to Central Perk
          </h2>
          <p className="text-xl" style={{ color: "#674188" }}>
            Where every friendship begins with a cup of coffee
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
