"use client";
import React, { useState } from "react";
import { Lock, Mail, MoveLeft, User, Coffee, ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useForm, SubmitHandler } from "react-hook-form";
import { signup } from "@/app/_actions/signup";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";
import { signIn } from "next-auth/react";
import { useMutation } from "@tanstack/react-query";

type SignupFormInputs = {
  email: string;
  password: string;
  name: string;
};

const SignupPage: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignupFormInputs>();

  const signupMutation = useMutation({
    mutationFn: (data: SignupFormInputs) => signup(data),
    onSuccess: (data) => {
      if (data.error) {
        console.error("Error while signing up:", data.error);
      } else {
        console.log("Signup successful!");
      }
    },
    onError: (error) => {
      console.error("Error while signing up:", error);
    },
  });

  const onSubmit: SubmitHandler<SignupFormInputs> = (data) => {
    signupMutation.mutate(data);
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

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="relative">
              <Mail
                className="absolute left-3 top-1/2 transform -translate-y-1/2"
                color="#674188"
              />
              <input
                type="email"
                placeholder="Email(Required)"
                {...register("email", { required: "Email is required" })}
                disabled={isSubmitting}
                className="w-full pl-10 pr-4 py-3 rounded-lg"
                style={{
                  backgroundColor: "#F7EFE5",
                  color: "#674188",
                  border: "2px solid #674188",
                }}
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div className="relative">
              <User
                className="absolute left-3 top-1/2 transform -translate-y-1/2"
                color="#674188"
              />
              <input
                type="text"
                placeholder="Name(Required)"
                {...register("name", { required: "Name is required" })}
                disabled={isSubmitting}
                className="w-full pl-10 pr-4 py-3 rounded-lg"
                style={{
                  backgroundColor: "#F7EFE5",
                  color: "#674188",
                  border: "2px solid #674188",
                }}
              />
              {errors.name && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.name.message}
                </p>
              )}
            </div>

            <div className="relative">
              <Lock
                className="absolute left-3 top-1/2 transform -translate-y-1/2"
                color="#674188"
              />
              <input
                type="password"
                placeholder="Password(Required)"
                {...register("password", { required: "Password is required" })}
                disabled={isSubmitting}
                className="w-full pl-10 pr-4 py-3 rounded-lg"
                style={{
                  backgroundColor: "#F7EFE5",
                  color: "#674188",
                  border: "2px solid #674188",
                }}
              />
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 rounded-lg font-bold transition-all duration-300 hover:scale-105"
              style={{
                backgroundColor: "#674188",
                color: "#F7EFE5",
              }}
            >
              {isSubmitting ? "Loading..." : "Sign up"}
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
            onClick={SigninWithGoogle}
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
