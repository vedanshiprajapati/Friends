"use client";

import React from "react";
import { Frown, Sofa, RefreshCw } from "lucide-react";

const FriendsErrorPage: React.FC = () => {
  console.log("erorr card");
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center p-6"
      style={{
        backgroundColor: "#F7EFE5",
        fontFamily: "'Arial', sans-serif",
      }}
    >
      <div
        className="text-center p-8 rounded-xl shadow-2xl"
        style={{
          backgroundColor: "#C8A1E0",
          border: "4px solid #674188",
        }}
      >
        <Frown size={100} color="#674188" className="mx-auto mb-6" />

        <h1 className="text-5xl font-bold mb-4" style={{ color: "#674188" }}>
          Oh. My. God.
        </h1>

        <h2 className="text-3xl mb-6" style={{ color: "#674188" }}>
          We're on a BREAK... from this page!
        </h2>

        <p className="text-xl mb-8" style={{ color: "#674188" }}>
          The page you're looking for has vanished faster than Ross's marriages!
        </p>

        <div className="flex justify-center space-x-4">
          <button
            onClick={() => (window.location.href = "/")}
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
            <RefreshCw className="mr-2" /> Go Home
          </button>

          <button
            onClick={() => window.history.back()}
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
            <Sofa className="mr-2" /> Back to Central Perk
          </button>
        </div>
      </div>

      {/* Fun Easter Egg Section */}
      <div
        className="mt-12 p-6 rounded-xl text-center"
        style={{
          backgroundColor: "#E2BFD9",
          color: "#674188",
        }}
      >
        <p className="italic text-lg">
          "Could this ERROR page BE any more confusing?" - Chandler Bing
        </p>
      </div>
    </div>
  );
};

export default FriendsErrorPage;
