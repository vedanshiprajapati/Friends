import { useQueryClient } from "@tanstack/react-query";
import { useCallback, useEffect } from "react";
import { pusherClient } from "../lib/pusher";

// types/index.ts
interface UnreadCount {
  spaceId?: string;
  conversationId?: string;
  count: number;
}

export function usePusherUnreads(userId: string) {
  const queryClient = useQueryClient();

  const handleUnreadUpdate = useCallback(
    (data: UnreadCount) => {
      // Update unread counts in sidebar and conversation list
      queryClient.setQueryData(["unreads"], (old: any) => ({
        ...old,
        [(data.conversationId || data.spaceId) as string]: data.count,
      }));
    },
    [queryClient]
  );

  useEffect(() => {
    if (!userId) return;

    // Subscribe to user-specific channel for unread updates
    const channel = pusherClient.subscribe(`presence-user-${userId}`);
    channel.bind("unread:update", handleUnreadUpdate);

    return () => {
      channel.unbind("unread:update", handleUnreadUpdate);
      pusherClient.unsubscribe(`presence-user-${userId}`);
    };
  }, [userId, handleUnreadUpdate]);
}
