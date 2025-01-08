"use client";
import React, { useRef } from "react";
import { MessageInput } from "./Messageinput";
import { Header } from "./Header";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import Loader from "@/app/_components/Loader";
import { otherUser } from "@/app/types/user";
import { postDmMessage, postSpaceMessage } from "@/app/_data/util";
import { Message } from "@/app/types/message";
import { Space } from "@/app/types/space";
import MessageBox from "./Messagecard";

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
  const bottomRef = useRef<HTMLDivElement>(null);
  const { data, isLoading, isError, error } = useQuery({
    queryKey: [
      chatType === "dm" ? "IndividualDmData" : "IndividualSpaceData",
      id,
    ],
    queryFn: () => fetchFn(id),
  });

  if (!id) {
    return <p>Id is not given id: {id}</p>;
  }

  if (isLoading) {
    return (
      <div className="w-full h-full flex justify-center items-center">
        <Loader />
      </div>
    );
  }

  if (isError || !data) {
    console.error(error);
    return <p>Error has occurred!</p>;
  }

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
    <div className="flex flex-col h-[calc(100vh-4rem)] min-w-fit flex-grow central-perk-bg text-black border-b border-t border-x border-lavender ">
      {/* Header */}
      {chatType === "dm" ? (
        <Header user={chatData.headerUser} />
      ) : (
        <Header spaceData={chatData.headerData} />
      )}
      {/* Main Content Container */}
      <div className="flex-1 flex flex-col  overflow-y-auto">
        {/* Chat Info Section - Fixed at Top */}
        <div className="overflow-y-scroll flex-1 ">
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-deepPurple rounded-full flex items-center justify-center text-white text-2xl mx-auto mb-4">
              {chatData.avatar}
            </div>
            <h2 className="text-xl font-medium mb-1">{chatData.title}</h2>
            <p className="text-gray-500 text-sm mb-1">{chatData.subtitle}</p>
          </div>

          {/* Messages Container - Scrollable */}
          <div className="flex-1 overflow-auto px-4 min-h-0">
            <div className="flex flex-col justify-end min-h-full ">
              {currentUserId &&
                chatData.messages.map((msg, i) => {
                  return (
                    <MessageBox
                      chatType={chatType}
                      isLast={i === chatData.messages.length - 1}
                      msg={msg}
                      currentUserId={currentUserId}
                      key={msg.id}
                    />
                  );
                })}
            </div>
            <div ref={bottomRef} />
          </div>
          {/* <MessageBody
            chatType={chatType}
            messages={chatData.messages}
            currentUserId={currentUserId!}
            id={id}
          /> */}
        </div>

        {/* Message Input - Fixed at Bottom */}
        <div className="border-t border-lavender bg-white flex-shrink-0">
          <MessageInput
            chatId={id}
            chatType={chatType}
            onSendMessage={chatType === "dm" ? postDmMessage : postSpaceMessage}
          />
        </div>
      </div>
    </div>
  );
};

export default DynamicChatBox;
