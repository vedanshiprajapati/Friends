"use client";

import React, { useEffect, useRef, useCallback } from "react";
import { useMutation } from "@tanstack/react-query";
import Loader from "@/app/_components/Loader";
import { SpaceMessage } from "@/app/types/space";
import SpaceMessageBox from "./spaceMessagebox";

interface SpaceMessageListProps {
  id: string;
  currentUserId: string;
  messages: SpaceMessage[];
  fetchNextPage: () => void;
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
}

const SpaceMessageList = ({
  id,
  currentUserId,
  messages,
  fetchNextPage,
  hasNextPage,
  isFetchingNextPage,
}: SpaceMessageListProps) => {
  const listRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  // Mark messages as read
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
  });

  useEffect(() => {
    if (currentUserId && id) {
      markAsReadMutation.mutate();
    }
  }, [id, currentUserId]);

  // Scroll to bottom on initial load
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  // Infinite scroll logic
  const handleScroll = useCallback(() => {
    const element = listRef.current;
    if (!element) return;

    const { scrollTop } = element;
    if (scrollTop === 0 && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  useEffect(() => {
    const element = listRef.current;
    if (!element) return;

    element.addEventListener("scroll", handleScroll);
    return () => element.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);
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
          <SpaceMessageBox
            key={msg.id}
            msg={msg}
            currentUserId={currentUserId}
            isLast={i === messages.length - 1}
          />
        ))}
        <div ref={bottomRef} />
      </div>
    </div>
  );
};

export default SpaceMessageList;
