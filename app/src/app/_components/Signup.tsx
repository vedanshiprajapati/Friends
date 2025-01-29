"use client";
import React, { useState } from "react";
import { Lock, Mail, MoveLeft, User, Coffee, ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { signup } from "@/app/_actions/signup";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";
import { signIn } from "next-auth/react";
import { z } from "zod";
import { StrictRegisterSchema } from "@/schemas";
import { zodResolver } from "@hookform/resolvers/zod";

type SignupSchemaType = z.infer<typeof StrictRegisterSchema>;

const SignupPage: React.FC = () => {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupSchemaType>({
    resolver: zodResolver(StrictRegisterSchema),
  });

  const onSubmit = async (data: SignupSchemaType) => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await signup(data);

      if (response?.status === "error") {
        setError(response.message);
      }
    } catch (err) {
      setError("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
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

          {error && (
            <div className="mb-4 p-3 rounded bg-red-100 border border-red-400 text-red-700">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Email Input Group */}
            <div className="space-y-1">
              <div className="relative h-12">
                <Mail
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 z-10"
                  color="#674188"
                />
                <input
                  type="email"
                  placeholder="Email(Required)"
                  {...register("email")}
                  disabled={isLoading}
                  className="w-full h-full pl-10 pr-4 rounded-lg"
                  style={{
                    backgroundColor: "#F7EFE5",
                    color: "#674188",
                    border: errors.email
                      ? "2px solid #EF4444"
                      : "2px solid #674188",
                  }}
                />
              </div>
              {errors.email && (
                <p className="text-red-500 text-sm">{errors.email.message}</p>
              )}
            </div>

            {/* Name Input Group */}
            <div className="space-y-1">
              <div className="relative h-12">
                <User
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 z-10"
                  color="#674188"
                />
                <input
                  type="text"
                  placeholder="Name(Required)"
                  {...register("name")}
                  disabled={isLoading}
                  className="w-full h-full pl-10 pr-4 rounded-lg"
                  style={{
                    backgroundColor: "#F7EFE5",
                    color: "#674188",
                    border: errors.name
                      ? "2px solid #EF4444"
                      : "2px solid #674188",
                  }}
                />
              </div>
              {errors.name && (
                <p className="text-red-500 text-sm">{errors.name.message}</p>
              )}
            </div>

            {/* Password Input Group */}
            <div className="space-y-1">
              <div className="relative h-12">
                <Lock
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 z-10"
                  color="#674188"
                />
                <input
                  type="password"
                  placeholder="Password(Required)"
                  {...register("password")}
                  disabled={isLoading}
                  className="w-full h-full pl-10 pr-4 rounded-lg"
                  style={{
                    backgroundColor: "#F7EFE5",
                    color: "#674188",
                    border: errors.password
                      ? "2px solid #EF4444"
                      : "2px solid #674188",
                  }}
                />
              </div>
              {errors.password && (
                <p className="text-red-500 text-sm">
                  {errors.password.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 font-bold transition-all duration-300 disabled:opacity-50"
              style={{
                backgroundColor: "#674188",
                color: "#F7EFE5",
              }}
            >
              {isLoading ? "Signing up..." : "Sign up"}
            </button>
          </form>

          <div className="flex items-center my-6">
            <div className="w-auto h-1 bg-[#674188] flex-grow rounded-full"></div>
            <div className="mx-4 text-[#674188]">OR</div>
            <div className="w-auto h-1 bg-[#674188] flex-grow rounded-full"></div>
          </div>

          <button
            className="w-full py-3 font-bold transition-all duration-300 flex items-center justify-center"
            style={{
              backgroundColor: "#674188",
              color: "#F7EFE5",
            }}
            onClick={SigninWithGoogle}
          >
            <p className="px-2">Sign up with </p>
            <Image
              src={"/googleLogo.png"}
              alt="google logo"
              height={30}
              width={30}
              className="p-1 border-0"
            />
          </button>

          <div className="text-center mt-4">
            <Link
              href={"/auth/signin"}
              className="text-sm flex items-center justify-center hover:underline"
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
