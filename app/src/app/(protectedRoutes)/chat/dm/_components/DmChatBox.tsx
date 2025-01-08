"use client";
import React, { useEffect, useRef, useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import Loader from "@/app/_components/Loader";
import { otherUser } from "@/app/types/user";
import { postDmMessage } from "@/app/_data/util";
import { DmMessage } from "@/app/types/message";
import { getIndividualDm } from "@/app/_actions/getIndividualDm";
import { Header } from "@/app/(protectedRoutes)/chat/_components/Chatbox/Header";
import MessageBox from "@/app/(protectedRoutes)/chat/_components/Chatbox/Messagecard";
import { MessageInput } from "@/app/(protectedRoutes)/chat/_components/Chatbox/Messageinput";
import { pusherClient } from "@/app/lib/pusher";
import { dmMessageType } from "@/app/types/dm";
import DynamicErrorCard from "@/app/_components/DynamicErrorcard";

interface DmResponse {
  otherUser: otherUser;
  messages: DmMessage[];
}

const DmChatBox = ({ id }: { id: string }) => {
  const session = useSession();
  const currentUserId = session.data?.user.id;
  const bottomRef = useRef<HTMLDivElement>(null);
  const [latestMessages, setLatestMessages] = useState<dmMessageType[]>([]);

  // Fetch DM data using React Query
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["IndividualDmData", id],
    queryFn: () => getIndividualDm(id),
  });

  // Initialize `latestMessages` with data from React Query
  useEffect(() => {
    if (data) {
      setLatestMessages(data.messages);
    }
  }, [data]);

  // Mark messages as read
  const markAsReadMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch(`/api/dms/individual/${id}/isRead`, {
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
  });

  // Trigger the mutation when the component mounts or when the id/currentUserId changes
  useEffect(() => {
    if (currentUserId && id) {
      markAsReadMutation.mutate();
    }
  }, [id, currentUserId]);

  // Subscribe to Pusher for real-time updates
  useEffect(() => {
    if (!id) return;

    // Subscribe to the channel
    pusherClient.subscribe(id);

    // Bind to the "messages:new" event
    const handleNewMessage = (newMessage: dmMessageType) => {
      setLatestMessages((prevMessages) => {
        const isDuplicate = prevMessages.some(
          (msg) => msg.id === newMessage.id
        );
        if (isDuplicate) {
          return prevMessages;
        }
        return [...prevMessages, newMessage];
      });
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    pusherClient.bind("messages:new", handleNewMessage);

    // Cleanup
    return () => {
      console.log("Cleaning up Pusher subscription for channel:", id); // Debugging
      pusherClient.unsubscribe(id);
      pusherClient.unbind("messages:new", handleNewMessage);
    };
  }, [id]);

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

  const { otherUser } = data as DmResponse;

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] min-w-fit flex-grow central-perk-bg text-black border-b border-t border-x border-lavender ">
      {/* Header */}
      <Header user={otherUser} />

      {/* Main Content Container */}
      <div className="flex-1 flex flex-col overflow-y-auto">
        {/* Chat Info Section - Fixed at Top */}
        <div className="overflow-y-scroll flex-1 ">
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-deepPurple rounded-full flex items-center justify-center text-white text-2xl mx-auto mb-4">
              {otherUser.name?.[0]}
            </div>
            <h2 className="text-xl font-medium mb-1">{otherUser.name}</h2>
            <p className="text-gray-500 text-sm mb-1">@{otherUser.username}</p>
          </div>

          {/* Messages Container - Scrollable */}
          <div className="flex-1 overflow-auto px-4 min-h-0">
            <div className="flex flex-col justify-end min-h-full ">
              {currentUserId &&
                latestMessages.map((msg, i) => {
                  // Debugging
                  return (
                    <MessageBox
                      key={msg.id}
                      chatType="dm"
                      isLast={i === latestMessages.length - 1}
                      msg={msg}
                      currentUserId={currentUserId}
                    />
                  );
                })}
            </div>
            <div ref={bottomRef} />
          </div>
        </div>

        {/* Message Input - Fixed at Bottom */}
        <div className="border-t border-lavender bg-white flex-shrink-0">
          <MessageInput
            chatId={id}
            chatType="dm"
            onSendMessage={postDmMessage}
          />
        </div>
      </div>
    </div>
  );
};

export default DmChatBox;
