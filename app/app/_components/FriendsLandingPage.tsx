"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  MessageCircle,
  Users,
  Coffee,
  PlayCircle,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";
const FRIENDS_CHARACTERS = [
  {
    name: "Ross",
    avatar: "/ross.png",
    quote: "We were on a break!",
    backgroundColor: "#674188",
  },
  {
    name: "Rachel",
    avatar: "/rachel.png",
    quote: "No uterus, no opinion.",
    backgroundColor: "#C8A1E0",
  },
  {
    name: "Chandler",
    avatar: "/chandler.png",
    quote: "Could I BE any more sarcastic?",
    backgroundColor: "#E2BFD9",
  },
  {
    name: "Monica",
    avatar: "/monica.png",
    quote: "I know!",
    backgroundColor: "#674188",
  },
  {
    name: "Joey",
    avatar: "/joey.png",
    quote: "How you doin'?",
    backgroundColor: "#C8A1E0",
  },
  {
    name: "Phoebe",
    avatar: "/pheobe.png",
    quote: "Oh. My. God.",
    backgroundColor: "#E2BFD9",
  },
];

const FriendsLandingPage: React.FC = () => {
  const [activeSection, setActiveSection] = useState<
    "concept" | "features" | "how-it-works"
  >("concept");
  const [selectedCharacter, setSelectedCharacter] = useState<string | null>(
    null
  );
  return (
    <div
      className="min-h-screen flex flex-col"
      style={{
        backgroundColor: "#F7EFE5",
        fontFamily: "'Arial', sans-serif",
      }}
    >
      {/* Navigation */}
      <header className="flex justify-between items-center p-6">
        <div className="flex items-center">
          <MessageCircle size={40} color="#674188" className="mr-4" />
          <h1 className="text-3xl font-bold" style={{ color: "#674188" }}>
            Friends Chat
          </h1>
        </div>
        <nav className="flex space-x-6">
          <Link href={"/auth/signin"}>
            <button
              className="px-4 py-2 rounded-full"
              style={{
                backgroundColor: "#674188",
                color: "#F7EFE5",
              }}
            >
              Sign In
            </button>
          </Link>
          <Link href={"/auth/signup"}>
            <button
              className="px-4 py-2 rounded-full"
              style={{
                backgroundColor: "#E2BFD9",
                color: "#674188",
              }}
            >
              Sign Up
            </button>
          </Link>
        </nav>
      </header>

      {/* Hero Section */}
      <main className="flex-grow container mx-auto px-6 py-12 grid md:grid-cols-2 gap-12 items-center">
        {/* Left Side - Text Content */}
        <div>
          <h1 className="text-5xl font-bold mb-6" style={{ color: "#674188" }}>
            CHAT LIKE YOU'RE IN CENTRAL PERK
          </h1>
          <p className="text-xl mb-8" style={{ color: "#674188" }}>
            Join your favorite Friends character's group and experience the most
            nostalgic chat experience ever!
          </p>

          {/* Call to Action Buttons */}
          <div className="flex space-x-4">
            <button
              className="flex items-center px-6 py-3 rounded-full text-lg font-bold"
              style={{
                backgroundColor: "#674188",
                color: "#F7EFE5",
              }}
            >
              Get Started <ArrowRight className="ml-2" />
            </button>

            <Link
              href={"https://www.netflix.com/in/title/70153404"}
              target="_blank"
            >
              <button
                className="flex items-center px-6 py-3 rounded-full text-lg"
                style={{
                  backgroundColor: "#E2BFD9",
                  color: "#674188",
                }}
              >
                <PlayCircle className="mr-2" /> Watch Trailer
              </button>
            </Link>
          </div>
        </div>

        {/* Right Side - Illustration */}
        <div className="flex justify-center items-center">
          <div
            className="w-full max-w-md h-96 rounded-xl flex items-center justify-center"
            style={{
              backgroundColor: "#C8A1E0",
              border: "4px solid #674188",
            }}
          >
            <Image
              src={"/landingPage.png"}
              alt="ross"
              className="rounded-xl w-auto"
              width={400}
              height={300}
            />
          </div>
        </div>
      </main>

      <div className="grid grid-cols-3 gap-8 px-6 py-12">
        {FRIENDS_CHARACTERS.map((character) => (
          <div
            key={character.name}
            className={`
                rounded-xl p-6 text-center cursor-pointer 
                transform transition-all duration-300 
                hover:scale-105 
                ${
                  selectedCharacter === character.name
                    ? "ring-4 ring-offset-2"
                    : ""
                }
              `}
            style={{
              backgroundColor: character.backgroundColor,
              borderColor: "#674188",
              color: "#F7EFE5",
            }}
            onClick={() => setSelectedCharacter(character.name)}
          >
            {/* <img
              src={character.avatar}
              alt={character.name}
              className="mx-auto mb-4 rounded-full w-32 h-32 object-cover"
            /> */}
            <Image
              src={character.avatar}
              alt="ross"
              className="mx-auto mb-4 rounded-full w-32 h-36 object-cover"
              width={50}
              height={60}
            />
            <h3 className="text-2xl font-bold">{character.name}</h3>
            <p className="italic mt-2">"{character.quote}"</p>
          </div>
        ))}
      </div>

      {/* Features Section */}
      <section className="py-16 px-6" style={{ backgroundColor: "#E2BFD9" }}>
        <div className="container mx-auto">
          <h3
            className="text-4xl text-center mb-12"
            style={{ color: "#674188" }}
          >
            How Friends Chat Works
          </h3>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div
              className="p-6 rounded-xl text-center"
              style={{
                backgroundColor: "#F7EFE5",
                color: "#674188",
              }}
            >
              <Users size={48} className="mx-auto mb-4" />
              <h4 className="text-2xl font-bold mb-4">
                Join a Character Group
              </h4>
              <p>
                Choose your favorite Friends character and join their exclusive
                chat group!
              </p>
            </div>

            {/* Feature 2 */}
            <div
              className="p-6 rounded-xl text-center"
              style={{
                backgroundColor: "#F7EFE5",
                color: "#674188",
              }}
            >
              <MessageCircle size={48} className="mx-auto mb-4" />
              <h4 className="text-2xl font-bold mb-4">Group Conversations</h4>
              <p>
                Chat with others who share your love for your favorite Friends
                character!
              </p>
            </div>

            {/* Feature 3 */}
            <div
              className="p-6 rounded-xl text-center"
              style={{
                backgroundColor: "#F7EFE5",
                color: "#674188",
              }}
            >
              <Coffee size={48} className="mx-auto mb-4" />
              <h4 className="text-2xl font-bold mb-4">Community Vibes</h4>
              <p>
                Experience the warmth and humor of Friends, right in your chat!
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer
        className="p-6 text-center"
        style={{ backgroundColor: "#C8A1E0" }}
      >
        <p className="text-sm" style={{ color: "#674188" }}>
          © 2024 Friends Chat. Could we BE any more social?
        </p>
      </footer>
    </div>
  );
};

export default FriendsLandingPage;
