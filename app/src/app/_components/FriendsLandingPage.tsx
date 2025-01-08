import React from "react";
import Image from "next/image";
import {
  MessageCircle,
  Users,
  Coffee,
  PlayCircle,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";
import { FRIENDS_CHARACTERS } from "@/app/_data/constants";

const FriendsLandingPage: React.FC = () => {
  // const [selectedCharacter, setSelectedCharacter] = useState<string | null>(
  //   null
  // );
  return (
    <div
      className="min-h-screen flex flex-col bg-cream"
      style={{
        fontFamily: "'Arial', sans-serif",
      }}
    >
      {/* Navigation */}
      <header className="flex justify-between items-center py-3 px-6">
        <div className="flex items-center ">
          <MessageCircle size={40} className="mr-2 text-deepPurple" />
          <h1 className="text-2xl font-bold text-deepPurple">Friends Chat</h1>
        </div>
        <div>
          <nav className="flex space-x-6 bg-cream">
            <Link href={"/auth/signin"} className="border-none">
              <button className="flex items-center px-4 py-2 shadow-none text-cream bg-deepPurple">
                Sign In
              </button>
            </Link>
            <Link href={"/auth/signup"} className="border-none">
              <button className="px-4 py-2 bg-lavender text-deepPurple">
                Sign Up
              </button>
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <div className="flex justify-between  p-12 items-center">
        {/* Left Side - Text Content */}
        <div className="block w-1/2">
          <div className="">
            <h1 className="text-4xl font-bold mb-6 text-deepPurple">
              CHAT LIKE YOU'RE IN CENTRAL PERK
            </h1>
            <p className="text-xl mb-8 text-deepPurple">
              Join your favorite Friends character's group and experience the
              most nostalgic chat experience ever!
            </p>

            {/* Call to Action Buttons */}
            <div className="flex space-x-4">
              <Link className="border-none" href={"/auth/signin"}>
                <button className="flex items-center px-6 py-3  text-lg font-bold text-cream bg-deepPurple">
                  Get Started <ArrowRight className="ml-2" />
                </button>
              </Link>
              <Link
                href={"https://www.netflix.com/in/title/70153404"}
                target="_blank"
                className="border-none"
              >
                <button className="flex items-center px-6 py-3  text-lg font-bold  bg-lavender text-deepPurple">
                  Watch Trailer <PlayCircle className="mr-2" />
                </button>
              </Link>
            </div>
          </div>
        </div>

        {/* Right Side - Illustration */}
        <div className="block mr-6">
          <div className="w-full max-w-md h-96 rounded-xl flex items-center justify-center bg-purple border-4 border-deepPurple px-8">
            <Image
              src={"/landingPage.png"}
              alt="ross"
              className="rounded-xl border w-auto"
              width={400}
              height={300}
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-8 px-6 py-12">
        {FRIENDS_CHARACTERS.map((character) => (
          <div
            key={character.name}
            className={`
                rounded-xl p-6 text-center cursor-pointer 
                transform transition-all duration-300 
                hover:scale-105 text-cream
              
              `}
            style={{
              backgroundColor: character.backgroundColor,
              borderColor: "#674188",
            }}
            // onClick={() => setSelectedCharacter(character.name)}
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
      <section className="py-16 px-6 bg-lavender">
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
              className="p-6 rounded-xl text-center bg-cream"
              style={{
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
              className="p-6 rounded-xl text-center bg-cream"
              style={{
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
              className="p-6 rounded-xl text-center bg-cream"
              style={{
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
      <footer className="p-6 text-center bg-purple">
        <p className="text-sm" style={{ color: "#674188" }}>
          © 2024 Friends Chat. Could we BE any more social?
        </p>
      </footer>
    </div>
  );
};

export default FriendsLandingPage;

// className={`
//   rounded-xl p-6 text-center cursor-pointer
//   transform transition-all duration-300
//   hover:scale-105 text-cream
//   ${
//     selectedCharacter === character.name
//       ? "ring-4 ring-offset-2"
//       : ""
//   }
// `}
