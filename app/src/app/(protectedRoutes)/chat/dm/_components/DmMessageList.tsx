"use client";
import Loader from "@/app/_components/Loader";
import { useMutation } from "@tanstack/react-query";
import { useCallback, useEffect, useRef, useState } from "react";
import MessageCard from "./Messagecard";

interface DmMessageListProps {
  id: string;
  currentUserId: string;
  messages: any[];
  fetchNextPage: () => void;
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
}

const DmMessageList = ({
  id,
  currentUserId,
  messages,
  fetchNextPage,
  hasNextPage,
  isFetchingNextPage,
}: DmMessageListProps) => {
  const listRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

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

  useEffect(() => {
    if (currentUserId && id) {
      markAsReadMutation.mutate();
    }
  }, [id, currentUserId]);

  // Scroll to bottom on initial load
  useEffect(() => {
    if (isInitialLoad && messages.length > 0) {
      bottomRef.current?.scrollIntoView({
        block: "start",
        behavior: "smooth",
      });
      setIsInitialLoad(false);
    }
  }, [messages, isInitialLoad]);

  // Infinite scroll logic
  const handleScroll = useCallback(() => {
    const element = listRef.current;
    if (!element) return;

    const { scrollTop } = element;
    if (scrollTop === 0 && hasNextPage && !isFetchingNextPage) {
      // Save the current scroll height before fetching new messages
      const scrollHeightBeforeFetch = element.scrollHeight;

      fetchNextPage();

      // After new messages are added, adjust the scroll position
      setTimeout(() => {
        const scrollHeightAfterFetch = element.scrollHeight;
        element.scrollTop = scrollHeightAfterFetch - scrollHeightBeforeFetch;
      }, 0);
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  useEffect(() => {
    const element = listRef.current;
    if (!element) return;

    element.addEventListener("scroll", handleScroll);
    return () => element.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  // Reverse the messages array to display newest at the bottom
  const reversedMessages = [...messages].reverse();

  return (
    <div ref={listRef} className="flex-1 overflow-y-auto px-4">
      <div className="flex flex-col justify-end min-h-full">
        {isFetchingNextPage && (
          <div className="mx-auto">
            <Loader />
          </div>
        )}
        {reversedMessages.map((msg, i) => (
          <MessageCard
            key={msg.id}
            chatType="dm"
            isLast={i === reversedMessages.length - 1}
            msg={msg}
            currentUserId={currentUserId}
          />
        ))}
        <div ref={bottomRef} />
      </div>
    </div>
  );
};

export default DmMessageList;
