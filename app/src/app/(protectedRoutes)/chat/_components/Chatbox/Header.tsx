"use Client";
import { Avatar, AvatarImage } from "@/app/_components/ui/Avatar";
import {
  DEFAULT_PROFILE_IMAGE,
  DEFAULT_SPACE_IMAGE,
} from "@/app/_data/constants";
import { otherUser } from "@/app/types/user";
import { Space } from "@prisma/client";
import {
  ArrowLeft,
  ChevronDown,
  EllipsisVertical,
  Maximize2,
  Search,
  Users,
  X,
} from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useMemo } from "react";

interface HeaderProps {
  user?: otherUser;
  spaceData?: Space;
  id: string;
}

export const Header = ({ user, spaceData, id }: HeaderProps) => {
  const route = useRouter();
  const searchParams = useSearchParams();
  const path = usePathname();
  const isChatboxInHome = useMemo(() => {
    if (path === "/chat/home" || path === "/chat/explore") {
      return true;
    } else {
      return false;
    }
  }, [path]);
  const showInfo = searchParams.get("info") === "true";

  const toggleInfo = () => {
    const params = new URLSearchParams(searchParams);
    if (showInfo) {
      params.delete("info");
    } else {
      params.set("info", "true");
    }
    route.push(`${window.location.pathname}?${params.toString()}`);
  };

  // Common header content
  const headerContent = spaceData
    ? {
        name: spaceData.name,
        initial: spaceData.name[0].toUpperCase(),
        subtitle: spaceData.description,
        isSpace: true,
        spaceId: spaceData.id,
        image: spaceData.image ? spaceData.image : DEFAULT_SPACE_IMAGE,
      }
    : user
    ? {
        name: user.name,
        initial: user.name && user.name[0].toUpperCase(),
        subtitle: user.username ? `@${user.username}` : "",
        isSpace: false,
        image: user.image ? user.image : DEFAULT_PROFILE_IMAGE,
      }
    : null;

  if (!headerContent) return null;

  return (
    <div className="bg-white border-b border-t border-lavender rounded-t-2xl">
      <div className="flex items-center px-4 h-14">
        {isChatboxInHome ? (
          <button
            className="p-2 hover:bg-purple/10 rounded-full"
            onClick={() => {
              route.push(
                `/chat/${headerContent.isSpace ? "space" : "dm"}/${id}`
              );
            }}
          >
            <Maximize2 size={20} className="text-deepPurple" />
          </button>
        ) : (
          <button
            className="p-2 hover:bg-purple/10 rounded-full"
            onClick={() => {
              route.back();
            }}
          >
            <ArrowLeft size={20} className="text-deepPurple" />
          </button>
        )}

        <div
          className="flex flex-grow items-center ml-2 hover:cursor-pointer"
          onClick={toggleInfo}
        >
          <Avatar>
            {headerContent.image && <AvatarImage src={headerContent.image} />}
          </Avatar>

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

        <div className="ml-auto flex items-center space-x-4 ">
          {headerContent.isSpace && (
            <button
              className="p-2 rounded-full"
              aria-label="Members"
              onClick={() =>
                route.push(`/chat/space/${headerContent.spaceId}/management`)
              }
            >
              <Users size={20} className="" />
            </button>
          )}
          <button className="p-2 rounded-full" aria-label="Search">
            <Search size={20} className="text-deepPurple" />
          </button>
          <button className="p-2 rounded-full" aria-label="Options">
            <EllipsisVertical size={20} className="text-deepPurple" />
          </button>
        </div>
      </div>

      {/* Tabs */}
      {/* <div className="flex px-4">
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
      </div> */}
    </div>
  );
};
