"use client";
import React from "react";
import { Clock } from "lucide-react";
import { MessageInput } from "./Messageinput";
import { Header } from "./Header";
import { useQuery } from "@tanstack/react-query";
import { getIndividualDm } from "@/app/_actions/getIndividualDm";
import { useSession } from "next-auth/react";
import MessageBox from "./Messagecard";
import Loader from "@/app/_components/Loader";
import { otherUser } from "@/app/types/user";

interface Message {
  id: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  isEdited: boolean;
  isRead: boolean;
  senderId: string;
  sender: {
    name: string;
    username: string;
  };
  receiver?: {
    name: string;
    username: string;
  };
}

interface SpaceMember {
  id: string;
  role: string;
  user: otherUser;
}

interface Space {
  id: string;
  name: string;
  description: string;
  inviteCode: string;
  isPrivate: boolean;
  isRandom: boolean;
  creatorId: string;
  createdAt: Date;
  updatedAt: Date;
  members: SpaceMember[];
  messages: Message[];
}

interface DmResponse {
  otherUser: otherUser;
  messages: Message[];
}

interface ChatBoxProps {
  id: string;
  chatType: "dm" | "space";
  fetchFn: (id: string) => {};
}

const DynamicChatBox = ({ id, chatType, fetchFn }: ChatBoxProps) => {
  const session = useSession();
  const currentUserId = session.data?.user.id;

  if (!id) {
    return <p>Id is not given</p>;
  }

  const { data, isLoading, isError, error } = useQuery({
    queryKey: [
      chatType === "dm" ? "IndividualDmData" : "IndividualSpaceData",
      id,
    ],
    queryFn: () => fetchFn(id),
  });

  if (isLoading)
    return (
      <div className="w-full h-full flex justify-center items-center">
        <Loader />
      </div>
    );

  if (isError || !data) {
    console.error(error);
    return <p>Error has occurred!</p>;
  }
  console.log(data, "Dataa");
  // Extract relevant data based on chat type
  const chatData =
    chatType === "dm"
      ? {
          title: (data as DmResponse)?.otherUser?.name || "Unknown",
          subtitle: `@${(data as DmResponse).otherUser?.username || "unknown"}`,
          avatar: (data as DmResponse).otherUser?.name?.[0] || "?",
          messages: (data as DmResponse).messages,
          headerUser: (data as DmResponse).otherUser,
        }
      : {
          title: (data as Space).name || "Unknown Space",
          subtitle: (data as Space).description || "",
          avatar: (data as Space).name?.[0] || "?",
          messages: (data as Space).messages,
          headerData: data as Space,
        };

  return (
    <div className="flex flex-col h-full min-w-fit flex-grow central-perk-bg text-black border-b border-t border-x border-lavender">
      {/* Header */}
      {chatType === "dm" ? (
        <Header user={chatData.headerUser} />
      ) : (
        <Header spaceData={chatData.headerData} />
      )}
      {/* Main Content Container */}
      <div className="flex-1 flex flex-col  relative">
        {/* Chat Info Section - Fixed at Top */}

        <div className="text-center py-8 ">
          <div className="w-16 h-16 bg-deepPurple rounded-full flex items-center justify-center text-white text-2xl mx-auto mb-4">
            {chatData.avatar}
          </div>
          <h2 className="text-xl font-medium mb-1">{chatData.title}</h2>
          <p className="text-gray-500 text-sm mb-1">{chatData.subtitle}</p>
        </div>

        {/* Messages Container - Scrollable */}
        <div className="flex-1 overflow-y-auto px-4">
          <div className="flex flex-col justify-end min-h-full pb-4">
            {chatData.messages.map((msg) => (
              <MessageBox
                msg={msg}
                currentUserId={currentUserId}
                key={msg.id}
              />
            ))}
          </div>
        </div>

        {/* Message Input - Fixed at Bottom */}
        <div className="border-t border-lavender bg-white">
          <MessageInput />
        </div>
      </div>
    </div>
  );
};

export default DynamicChatBox;
