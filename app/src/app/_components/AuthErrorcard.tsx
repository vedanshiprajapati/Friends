"use client";

import React from "react";
import { AlertTriangle, LogIn, Home } from "lucide-react";
import Link from "next/link";

interface AuthErrorPageProps {
  error?: string;
}

const AuthErrorCard: React.FC<AuthErrorPageProps> = ({
  error = "Something went wrong with your authentication",
}) => {
  return (
    <div
      className="min-h-screen flex items-center justify-center p-6"
      style={{
        backgroundColor: "#F7EFE5",
        fontFamily: "'Arial', sans-serif",
      }}
    >
      <div
        className="w-full max-w-md p-8 rounded-xl shadow-2xl"
        style={{
          backgroundColor: "#C8A1E0",
          border: "4px solid #674188",
        }}
      >
        <div className="text-center">
          <AlertTriangle size={80} color="#674188" className="mx-auto mb-6" />

          <h1 className="text-4xl font-bold mb-4" style={{ color: "#674188" }}>
            Authentication Oops!
          </h1>

          <p className="text-xl mb-6" style={{ color: "#674188" }}>
            {error === "Configuration"
              ? "Could you BE any more incorrect?"
              : "We were NOT on a break... with authentication!"}
          </p>

          <div
            className="bg-white p-4 rounded-lg mb-6"
            style={{
              backgroundColor: "#E2BFD9",
              color: "#674188",
            }}
          >
            <p className="text-sm">
              {error === "Configuration"
                ? "OH. MY. GOD! Invalid sign-in! Try signing in with your credentials Instead!"
                : "An unexpected error occurred during authentication."}
            </p>
          </div>

          <div className="flex justify-center space-x-4">
            <Link
              href="/auth/signin"
              className="
                flex items-center 
                px-6 py-3 rounded-full 
                font-bold text-lg
                transition-all duration-300 
                hover:scale-105
              "
              style={{
                backgroundColor: "#674188",
                color: "#F7EFE5",
              }}
            >
              <LogIn className="mr-2" /> Try Again
            </Link>

            <Link
              href="/"
              className="
                flex items-center 
                px-6 py-3 rounded-full 
                font-bold text-lg
                transition-all duration-300 
                hover:scale-105
              "
              style={{
                backgroundColor: "#E2BFD9",
                color: "#674188",
              }}
            >
              <Home className="mr-2" /> Home
            </Link>
          </div>
        </div>

        {/* Humorous Footer */}
        <div
          className="mt-6 text-center p-4 rounded-lg"
          style={{
            backgroundColor: "#F7EFE5",
            color: "#674188",
          }}
        >
          <p className="italic text-sm">
            "Could authentication BE any more complicated?" - Chandler
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthErrorCard;
