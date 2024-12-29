"use Client";
import { otherUser } from "@/app/types/user";
import { Space } from "@prisma/client";
import {
  ArrowLeft,
  ChevronDown,
  EllipsisVertical,
  Search,
  Users,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

// interface Space {
//   id: string;
//   name: string;
//   description: string;
//   inviteCode: string;
//   isPrivate: boolean;
//   isRandom: boolean;
//   creatorId: string;
//   members: Array<{
//     id: string;
//     role: string;
//     user: otherUser;
//   }>;
// }

interface HeaderProps {
  user?: otherUser;
  spaceData?: Space;
}

export const Header = ({ user, spaceData }: HeaderProps) => {
  const route = useRouter();
  const [activeTab, setActiveTab] = useState<"Chat" | "Shared">("Chat");

  // Common header content
  const headerContent = spaceData
    ? {
        name: spaceData.name,
        initial: spaceData.name[0].toUpperCase(),
        subtitle: spaceData.description,
        isSpace: true,
      }
    : user
    ? {
        name: user.name,
        initial: user.name && user.name[0].toUpperCase(),
        subtitle: user.username ? `@${user.username}` : "",
        isSpace: false,
      }
    : null;

  if (!headerContent) return null;

  return (
    <div className="bg-white border-b border-t border-lavender">
      <div className="flex items-center px-4 h-14">
        <button
          className="p-2 hover:bg-purple/10 rounded-full"
          onClick={() => {
            route.back();
          }}
        >
          <ArrowLeft size={20} className="text-deepPurple" />
        </button>

        <div className="flex items-center ml-2">
          <div className="w-8 h-8 bg-deepPurple rounded-full flex items-center justify-center text-white">
            {headerContent.initial}
          </div>
          <div className="ml-2">
            <div className="flex items-center">
              <span className="font-medium">{headerContent.name}</span>
              <ChevronDown size={16} className="ml-1 text-gray-500" />
            </div>
            {headerContent.subtitle && (
              <span className="text-xs text-gray-500">
                {headerContent.subtitle}
              </span>
            )}
          </div>
        </div>

        <div className="ml-auto flex items-center space-x-4">
          {headerContent.isSpace && (
            <button
              className="p-2 hover:bg-purple/10 rounded-full"
              aria-label="Members"
            >
              <Users size={20} className="text-deepPurple" />
            </button>
          )}
          <button
            className="p-2 hover:bg-purple/10 rounded-full"
            aria-label="Search"
          >
            <Search size={20} className="text-deepPurple" />
          </button>
          <button
            className="p-2 hover:bg-purple/10 rounded-full"
            aria-label="Options"
          >
            <EllipsisVertical size={20} className="text-deepPurple" />
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex px-4">
        {["Chat", "Shared"].map((tab) => (
          <button
            key={tab}
            className={`px-4 py-2 border-b-2 transition-colors ${
              activeTab === tab
                ? "border-deepPurple text-deepPurple"
                : "border-transparent text-gray-500 hover:text-deepPurple"
            }`}
            onClick={() => setActiveTab(tab as "Chat" | "Shared")}
          >
            {tab}
          </button>
        ))}
      </div>
    </div>
  );
};
