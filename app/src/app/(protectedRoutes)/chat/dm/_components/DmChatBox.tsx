"use client";
import React, { useMemo, useEffect, useCallback } from "react";
import {
  useInfiniteQuery,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import Loader from "@/app/_components/Loader";
import { Header } from "@/app/(protectedRoutes)/chat/_components/Chatbox/Header";
import { MessageInput } from "@/app/(protectedRoutes)/chat/_components/Chatbox/Messageinput";
import { useRouter, useSearchParams } from "next/navigation";
import DmInfo from "./DmInfo";
import DmMessageList from "./DmMessageList";
import { getDetailedDmData } from "@/app/_actions/getDetailedDmData";
import DynamicErrorCard from "@/app/_components/DynamicErrorcard";
import { postDmMessage } from "@/app/_data/util";
import { pusherClient } from "@/app/lib/pusher"; // Make sure to import your Pusher client

// Fetch messages function
const fetchMessages = async ({
  pageParam = null,
  id,
}: {
  pageParam?: string | null;
  id: string;
}) => {
  const response = await fetch(
    `/api/dms/individual/${id}${pageParam ? `?cursor=${pageParam}` : ""}`
  );
  if (!response.ok) {
    throw new Error("Failed to fetch messages");
  }
  const result = await response.json();
  return result.data;
};

const DmChatBox = ({ id }: { id: string }) => {
  const session = useSession();
  const currentUserId = session.data?.user.id!;
  const searchParams = useSearchParams();
  const router = useRouter();
  const queryClient = useQueryClient();

  const showInfo = useMemo(
    () => searchParams.get("info") === "true",
    [searchParams]
  );

  // Main conversation data query
  const { data: conversationData, isLoading: isLoadingConversation } = useQuery(
    {
      queryKey: ["DetailedDmData", id],
      queryFn: () => getDetailedDmData(),
    }
  );

  // Messages infinite query
  const {
    data: messagesData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading: isLoadingMessages,
  } = useInfiniteQuery({
    queryKey: ["messages", id],
    queryFn: ({ pageParam }) => fetchMessages({ pageParam, id }),
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
    initialPageParam: null,
  });

  // Handle new message from Pusher
  const handleNewMessage = useCallback(
    (newMessage: any) => {
      queryClient.setQueryData(["messages", id], (oldData: any) => {
        if (!oldData?.pages?.length) return oldData;

        // Create a new pages array with the new message added to the first page
        const newPages = [...oldData.pages];
        const firstPage = { ...newPages[0] };

        // Add the new message to the beginning of the first page's messages
        firstPage.messages = [newMessage.newMessage, ...firstPage.messages];
        newPages[0] = firstPage;

        return {
          ...oldData,
          pages: newPages,
        };
      });
    },
    [queryClient, id]
  );

  // Subscribe to Pusher channel
  useEffect(() => {
    if (!id) return;

    // Subscribe to the conversation channel
    const channel = pusherClient.subscribe(id);
    channel.bind("messages:new", handleNewMessage);

    return () => {
      channel.unbind("messages:new", handleNewMessage);
      pusherClient.unsubscribe(id);
    };
  }, [id, handleNewMessage]);

  // Combine all messages for DmInfo
  const allMessages = useMemo(() => {
    return messagesData?.pages.flatMap((page) => page.messages) ?? [];
  }, [messagesData]);

  if (!id) {
    return <p>Id is not given id: {id}</p>;
  }

  if (isLoadingConversation || isLoadingMessages) {
    return (
      <div className="w-full h-full flex justify-center items-center">
        <Loader />
      </div>
    );
  }

  if (!conversationData) {
    return (
      <div className="w-full h-full flex justify-center items-center">
        <DynamicErrorCard message="Failed to load conversation" />
      </div>
    );
  }

  const conversation = conversationData.find((dm) => dm.id === id);
  if (!conversation) {
    return <p>Conversation not found.</p>;
  }

  const otherUser = conversation.participants[0];

  return (
    <div className="flex flex-row h-[calc(100vh-4rem)]">
      <div className="flex flex-col h-[calc(100vh-4rem)] min-w-fit flex-grow central-perk-bg text-black border-b border-t border-x border-lavender rounded-t-2xl mr-1">
        <Header user={otherUser} />
        <div className="mt-4"></div>
        <DmMessageList
          id={id}
          currentUserId={currentUserId}
          messages={allMessages}
          fetchNextPage={fetchNextPage}
          hasNextPage={hasNextPage}
          isFetchingNextPage={isFetchingNextPage}
        />
        <div className="border-t border-lavender bg-white flex-shrink-0">
          <MessageInput
            chatId={id}
            chatType="dm"
            onSendMessage={postDmMessage}
          />
        </div>
      </div>
      {showInfo && (
        <div className="w-80 h-[calc(100vh-4rem)] border-l border-lavender overflow-y-auto">
          <DmInfo
            data={{
              otherUser,
              messages: allMessages,
            }}
            onClose={() => {
              const params = new URLSearchParams(searchParams);
              params.delete("info");
              router.replace(`?${params.toString()}`);
            }}
          />
        </div>
      )}
    </div>
  );
};

export default DmChatBox;
