"use client";

import React, { useCallback, useEffect, useMemo, useRef } from "react";
import {
  useInfiniteQuery,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { useSearchParams, useRouter } from "next/navigation";
import { Header } from "../../_components/Chatbox/Header";
import { MessageInput } from "@/app/(protectedRoutes)/chat/_components/Chatbox/Messageinput";
import Loader from "@/app/_components/Loader";
import DynamicErrorCard from "@/app/_components/DynamicErrorcard";
import SpaceInfo from "./SpaceInfo";
import { postSpaceMessage } from "@/app/_data/util";
import SpaceMessageList from "./SpaceMessageList";
import { getDetailedSpaceData } from "@/app/_actions/getDetailedSpaceData";
import supabase from "@/app/lib/supabase";

// Fetch messages function
const fetchMessages = async ({
  pageParam = null,
  id,
}: {
  pageParam?: string | null;
  id: string;
}) => {
  const response = await fetch(
    `/api/spaces/individual/${id}/${pageParam ? `?cursor=${pageParam}` : ""}`
  );
  if (!response.ok) {
    throw new Error("Failed to fetch messages");
  }
  const result = await response.json();
  return result.data;
};

const SpaceChatBox = ({ id }: { id: string }) => {
  const session = useSession();
  const currentUserId = session.data?.user.id!;
  const searchParams = useSearchParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const channelRef = useRef<any>(null);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const showInfo = useMemo(
    () => searchParams.get("info") === "true",
    [searchParams]
  );

  // Space data query
  const { data: spaceData, isLoading: isLoadingSpace } = useQuery({
    queryKey: ["DetailedSpaceData", id],
    queryFn: () => getDetailedSpaceData(),
  });

  // Messages infinite query
  const {
    data: messagesData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading: isLoadingMessages,
  } = useInfiniteQuery({
    queryKey: ["spaceMessages", id],
    queryFn: ({ pageParam }) => fetchMessages({ pageParam, id }),
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
    initialPageParam: null,
  });

  useEffect(() => {
    if (!id) return;

    // Cleanup previous channel and timer
    if (channelRef.current) {
      supabase.removeChannel(channelRef.current);
    }
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    const channel = supabase
      .channel(`space_messages:${id}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "SpaceMessage",
          filter: `spaceId=eq.${id}`,
        },
        (payload) => {
          // DEBOUNCE IMPLEMENTATION HERE
          if (debounceTimerRef.current) {
            clearTimeout(debounceTimerRef.current);
          }

          debounceTimerRef.current = setTimeout(() => {
            queryClient.setQueryData(["spaceMessages", id], (oldData: any) => {
              if (!oldData?.pages?.length) return oldData;
              const newPages = [...oldData.pages];
              const firstPage = { ...newPages[0] };
              firstPage.messages = [payload.new, ...firstPage.messages];
              newPages[0] = firstPage;
              return { ...oldData, pages: newPages };
            });
          }, 500); // 500ms delay
        }
      )
      .subscribe();

    channelRef.current = channel;

    return () => {
      // Cleanup channel and timer
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
      }
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [id, queryClient]);

  // Combine all messages for SpaceInfo
  const allMessages = useMemo(() => {
    return messagesData?.pages.flatMap((page) => page.messages) ?? [];
  }, [messagesData]);

  if (!id) return <p>Id is not given id: {id}</p>;

  if (isLoadingSpace || isLoadingMessages) {
    return (
      <div className="w-full h-full flex justify-center items-center">
        <Loader />
      </div>
    );
  }

  if (!spaceData) {
    return (
      <div className="w-full h-full flex justify-center items-center">
        <DynamicErrorCard message="Failed to load space" />
      </div>
    );
  }

  const space = spaceData.find((space) => space.id === id);

  if (!space) {
    return <div>no space found with this id: {id}</div>;
  }
  return (
    <div className="flex flex-row h-[calc(100vh-4rem)]">
      <div className="flex flex-col flex-grow central-perk-bg text-black border-b border-t border-x border-lavender rounded-t-2xl mr-1 overflow-hidden">
        <Header spaceData={space} id={id} />

        <div className="flex-1 flex flex-col overflow-y-auto">
          {/* <div className="text-center py-8">
            <Avatar className="w-16 h-16 flex items-center justify-center mx-auto mb-4">
              {space.image && <AvatarImage src={space.image} />}
            </Avatar>
            <h2 className="text-xl font-medium mb-1">{space.name}</h2>
            <p className="text-gray-500 text-sm mb-1">{space.description}</p>
          </div> */}

          <SpaceMessageList
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
              chatType="space"
              onSendMessage={postSpaceMessage}
            />
          </div>
        </div>
      </div>

      {showInfo && (
        <div className="w-80 h-[calc(100vh-4rem)] border-l border-lavender overflow-y-auto">
          <SpaceInfo
            space={space}
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

export default SpaceChatBox;
