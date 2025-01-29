"use client";

import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getDetailedDmData } from "@/app/_actions/getDetailedDmData";
import { getDetailedSpaceData } from "@/app/_actions/getDetailedSpaceData";
import DmChatBox from "../../dm/_components/DmChatBox";
import SpaceChatBox from "../../space/_components/SpaceChatBox";
import { formatDistanceToNow } from "date-fns";
import { Check, Users } from "lucide-react";
import { useSession } from "next-auth/react";
import DynamicErrorCard from "@/app/_components/DynamicErrorcard";

const Main = () => {
  const session = useSession();
  const currentUserId = session.data?.user.id;
  const [selectedTab, setSelectedTab] = useState<"dm" | "space">("dm");
  const [selectedConversation, setSelectedConversation] = useState<
    string | null
  >(null);
  const [selectedConversationType, setSelectedConversationType] = useState<
    "dm" | "space" | null
  >(null);

  const { data: dms } = useQuery({
    queryKey: ["DetailedDmData"],
    queryFn: () => getDetailedDmData(),
  });

  const {
    data: spaces,
    isLoading,
    isError,
    error,
    isFetching,
  } = useQuery({
    queryKey: ["DetailedSpaceData"],
    queryFn: () => getDetailedSpaceData(),
  });

  if (isError) {
    return (
      <div className="flex justify-center items-center">
        <DynamicErrorCard message={error.message} />
      </div>
    );
  }

  const getLastMessagePreview = (content: string) => {
    if (!content) return "No messages yet";
    return content.length > 50 ? `${content.substring(0, 50)}...` : content;
  };

  const ConversationItem = ({
    id,
    name,
    lastMessage = "No Messages sent",
    timestamp,
    sender,
    image,
    isOwnMessage,
    type,
  }: {
    id: string;
    name: string | null;
    lastMessage?: string;
    timestamp: Date;
    sender: string | null;
    image: string | null;
    isOwnMessage: boolean;
    type: "dm" | "space";
  }) => {
    const initial = name?.charAt(0).toUpperCase() || "?";
    return (
      <div
        onClick={() => {
          setSelectedConversation(id);
          setSelectedConversationType(type); // Set the type of the selected conversation
        }}
        className={`p-3 h-16 cursor-pointer transition-all duration-200 flex items-center gap-3 ${
          selectedConversation === id
            ? "bg-lightPurple1"
            : "hover:bg-lightPurple2"
        }`}
      >
        {image ? (
          <img
            src={image}
            alt={name || "User"}
            className="w-10 h-10 rounded-full flex-shrink-0 border-0"
          />
        ) : (
          <div className="w-10 h-10 rounded-full bg-deepPurple/10 flex items-center justify-center flex-shrink-0">
            <span className="text-lg font-medium text-deepPurple">
              {initial}
            </span>
          </div>
        )}

        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-center mb-0.5">
            <span className="font-medium text-sm text-gray-900 truncate pr-2">
              {name || "Unknown"}
            </span>
            <span className="text-[13px] text-gray-500 flex-shrink-0">
              {formatDistanceToNow(timestamp, { addSuffix: false })}
            </span>
          </div>
          <div className="text-[13px] text-gray-600 truncate">
            {sender ? (
              <span className="text-gray-900 mr-1">
                {isOwnMessage ? "You" : sender}:
              </span>
            ) : null}
            {getLastMessagePreview(lastMessage) || "No messages yet"}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex h-full bg-lightCream gap-3">
      <div className="w-1/3 border-lavender rounded-t-xl border-y border-x flex flex-col">
        <div className="p-4 h-14 border-b rounded-t-2xl border-lavender bg-white flex justify-between items-center">
          <p>HOME</p>
          {(!isLoading || !isFetching) && (
            <div
              onClick={() =>
                setSelectedTab(selectedTab === "dm" ? "space" : "dm")
              }
              className={`w-fit px-4 py-1 transition-transform duration-200 flex items-center gap-2 text-deepPurple text-xs rounded-full border-x border-y border-deepPurple hover:bg-lightPurple2 cursor-pointer ${
                selectedTab === "space" ? "bg-lightPurple2" : ""
              }`}
            >
              {selectedTab === "dm" ? (
                <>
                  <Users size={18} />
                  <span>Space</span>
                </>
              ) : (
                <>
                  <Check size={18} />
                  <span>Space</span>
                </>
              )}
            </div>
          )}
        </div>
        <div className="flex-1 overflow-y-auto">
          {isLoading &&
            [1, 2, 3].map((index) => <ConversationItemShimmer key={index} />)}
          {!isLoading &&
            selectedTab === "dm" &&
            (dms && dms?.length > 0 ? (
              dms?.map((dm) => (
                <ConversationItem
                  key={dm.id}
                  id={dm.id}
                  name={dm.participants[0].name}
                  lastMessage={dm.lastMessage?.content}
                  timestamp={
                    new Date(dm.lastMessage?.createdAt || dm.updatedAt)
                  }
                  sender={dm.lastMessage?.sender?.name}
                  image={dm.participants[0].image}
                  isOwnMessage={dm.lastMessage?.sender?.id === currentUserId}
                  type="dm"
                />
              ))
            ) : (
              <div className="flex flex-col justify-center items-center h-full -mt-8">
                <p className="text-lg font-medium mb-2">Conversations</p>
                <p className="text-sm">
                  Recent conversations will be shown here
                </p>
              </div>
            ))}

          {!isLoading &&
            selectedTab === "space" &&
            (spaces && spaces.length > 0 ? (
              spaces?.map((space) => {
                return (
                  <ConversationItem
                    key={space.id}
                    id={space.id}
                    name={space.name}
                    image={space.image}
                    lastMessage={
                      space.messages[0]?.image
                        ? "Sent an image"
                        : space.messages[0]?.content || ""
                    }
                    timestamp={
                      new Date(space.messages[0]?.createdAt || space.createdAt)
                    }
                    sender={space.messages[0]?.sender?.role}
                    isOwnMessage={
                      space.messages[0]?.sender?.user.id === currentUserId
                    }
                    type="space"
                  />
                );
              })
            ) : (
              <div className="flex flex-col justify-center items-center h-full -mt-8">
                <p className="text-lg font-medium mb-2">Conversations</p>
                <p className="text-sm">
                  Recent conversations will be shown here
                </p>
              </div>
            ))}
        </div>
      </div>

      <div className="flex-1 bg-white">
        {selectedConversation ? (
          selectedConversationType === "dm" ? (
            <DmChatBox id={selectedConversation} />
          ) : (
            <SpaceChatBox id={selectedConversation} />
          )
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="text-center text-deepPurple/60">
              <p className="text-lg font-medium mb-2">Select a conversation</p>
              <p className="text-sm">
                Choose a chat from the list to start messaging
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export const ConversationItemShimmer = () => {
  return (
    <div className="p-3 cursor-pointer flex items-center gap-3">
      {/* Avatar Shimmer */}
      <div className="w-10 h-10 rounded-full bg-lightPurple1 animate-pulse flex-shrink-0"></div>

      {/* Content Shimmer */}
      <div className="flex-1 min-w-0">
        {/* Name and Timestamp Shimmer */}
        <div className="flex justify-between items-center mb-0.5">
          <div className="h-4 w-2/4 bg-lightPurple1 animate-pulse rounded"></div>
        </div>

        {/* Last Message Shimmer */}
        <div className="h-3 w-full bg-lightPurple1 animate-pulse rounded"></div>
      </div>
    </div>
  );
};

export default Main;
