"use client";

import React, { useEffect, useRef } from "react";
import { MessageInput } from "../../_components/Chatbox/Messageinput";
import { Header } from "../../_components/Chatbox/Header";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import Loader from "@/app/_components/Loader";
import { postSpaceMessage } from "@/app/_data/util";
import { getIndividualSpace } from "@/app/_actions/getIndividualSpace";
import SpaceMessageBox from "./spaceMessagebox";
import DynamicErrorCard from "@/app/_components/DynamicErrorcard";

const SpaceChatBox = ({ id }: { id: string }) => {
  const session = useSession();
  const currentUserId = session.data?.user.id;
  const bottomRef = useRef<HTMLDivElement>(null);

  // Fetch Space data
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["IndividualSpaceData", id],
    queryFn: () => getIndividualSpace(id),
  });

  const markAsReadMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch(`/api/spaces/individual/${id}/isRead`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId: currentUserId }),
      });
      if (!response.ok) {
        throw new Error("Failed to mark messages as read");
      }
      return response.json();
    },

    onError: () => {
      return <p>Error has occured!</p>;
    },
  });

  // Trigger the mutation when the component mounts or when the id/chatType changes
  useEffect(() => {
    if (currentUserId && id) {
      markAsReadMutation.mutate();
    }
  }, [id, currentUserId]);

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
    return (
      <div className="w-full h-full flex justify-center items-center">
        <DynamicErrorCard message={error?.message} />
      </div>
    );
  }

  const space = data as any;

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] min-w-fit flex-grow central-perk-bg text-black border-b border-t border-x border-lavender ">
      {/* Header */}
      <Header spaceData={space} />

      {/* Main Content Container */}
      <div className="flex-1 flex flex-col overflow-y-auto">
        {/* Chat Info Section - Fixed at Top */}
        <div className="overflow-y-scroll flex-1 ">
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-deepPurple rounded-full flex items-center justify-center text-white text-2xl mx-auto mb-4">
              {space.name?.[0]}
            </div>
            <h2 className="text-xl font-medium mb-1">{space.name}</h2>
            <p className="text-gray-500 text-sm mb-1">{space.description}</p>
          </div>

          {/* Messages Container - Scrollable */}
          <div className="flex-1 overflow-auto px-4 min-h-0">
            <div className="flex flex-col justify-end min-h-full ">
              {currentUserId &&
                space.messages.map((msg: any, i: number) => (
                  // <MessageBox
                  //   key={msg.id}
                  //   chatType="space"
                  //   isLast={i === space.messages.length - 1}
                  //   msg={msg}
                  //   currentUserId={currentUserId}
                  // />
                  <SpaceMessageBox
                    msg={msg}
                    currentUserId={currentUserId}
                    isLast={i === space.messages.length - 1}
                    key={msg.id}
                  />
                ))}
            </div>
            <div ref={bottomRef} />
          </div>
        </div>

        {/* Message Input - Fixed at Bottom */}
        <div className="border-t border-lavender bg-white flex-shrink-0">
          <MessageInput
            chatId={id}
            chatType="space"
            onSendMessage={postSpaceMessage}
          />
        </div>
      </div>
    </div>
  );
};

export default SpaceChatBox;
