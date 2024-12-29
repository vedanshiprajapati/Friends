"use client";
import React from "react";
import { Clock } from "lucide-react";
import { MessageInput } from "./Messageinput";
import { Header } from "./Header";
import { useQuery } from "@tanstack/react-query";
import { getIndividualDm } from "@/app/_actions/getIndividualDm";
import { useSession } from "next-auth/react";
import Messagecard from "./Messagecard";
import Loader from "@/app/_components/Loader";

interface Message {
  id: string;
  sender: string;
  content: string;
  timestamp: string;
  reactions?: Array<{ emoji: string; count: number }>;
  isDeleted?: boolean;
}

interface ChatBoxProps {
  conversationId: string;
}

const ChatBox = ({ conversationId }: ChatBoxProps) => {
  const session = useSession();
  const currentUserId = session.data?.user.id;

  if (!conversationId) {
    return <p>conversationId is not given</p>;
  }

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["IndividualDmData", conversationId],
    queryFn: () => getIndividualDm(conversationId),
  });

  if (isLoading)
    return (
      <div className="w-full h-full flex justify-center items-center">
        <Loader />
      </div>
    );

  if (isError || !data) {
    console.log(error, "ERROR");
    return <p>Error has occured!</p>;
  }

  return (
    <div className="flex flex-col h-full min-w-fit flex-grow central-perk-bg text-black border-b border-t border-x border-lavender">
      {/* Header */}
      {data.otherUser && <Header user={data?.otherUser} />}

      {/* Main Content Container */}
      <div className="flex-1 flex flex-col relative">
        {/* User Info Section - Fixed at Top */}
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-deepPurple rounded-full flex items-center justify-center text-white text-2xl mx-auto mb-4">
            {data.otherUser?.name && data.otherUser?.name[0]}
          </div>
          <h2 className="text-xl font-medium mb-1">{data.otherUser?.name}</h2>
          {data.otherUser?.username && (
            <p className="text-gray-500 text-sm mb-1">
              @{data.otherUser.username}
            </p>
          )}
        </div>

        {/* Messages Container - Scrollable */}
        <div className="flex-1 overflow-y-auto px-4">
          <div className="flex flex-col justify-end min-h-full pb-4">
            {data.messages.map((msg) => (
              <Messagecard
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

export default ChatBox;
