"use client";
import React, { useState } from "react";
import { Lock, Mail, MoveLeft, Coffee } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { StrictLoginSchema } from "@/schemas";
import { signin } from "@/app/_actions/signin";
import { signIn } from "next-auth/react";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

type LoginSchemaType = z.infer<typeof StrictLoginSchema>;

const LoginPage: React.FC = () => {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginSchemaType>({
    resolver: zodResolver(StrictLoginSchema),
  });

  const onSubmit = async (data: LoginSchemaType) => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await signin(data);

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

          {error && (
            <div className="mb-4 p-3 rounded bg-red-100 border border-red-400 text-red-700">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-1">
              <div className="relative h-12">
                <Mail
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 z-10"
                  color="#674188"
                />
                <input
                  {...register("email")}
                  type="email"
                  placeholder="Email"
                  className={`w-full h-full pl-10 pr-4 rounded-lg ${
                    errors.email ? "border-red-500" : ""
                  }`}
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

            <div className="space-y-1">
              <div className="relative h-12">
                <Lock
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 z-10"
                  color="#674188"
                />
                <input
                  {...register("password")}
                  type="password"
                  placeholder="Password"
                  className={`w-full h-full pl-10 pr-4 rounded-lg ${
                    errors.password ? "border-red-500" : ""
                  }`}
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
              className="w-full py-3 font-bold transition-all duration-300 disabled:opacity-50"
              style={{
                backgroundColor: "#674188",
                color: "#F7EFE5",
              }}
              disabled={isLoading}
            >
              {isLoading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <div className="flex my-6 items-center">
            <div className="w-auto h-1 bg-[#674188] flex-grow rounded-full"></div>
            <div className="mx-2 text-[#674188]">or</div>
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
