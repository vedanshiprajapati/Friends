"use client";
import { useEffect, useRef, useState } from "react";
import MessageBox from "./Messagecard";
import { Message } from "@/app/types/message";
import { useMutation } from "@tanstack/react-query";

const MessageBody = ({
  currentUserId,
  messages,
  chatType,
  id,
}: {
  currentUserId: string;
  messages: Message[];
  chatType: "dm" | "space";
  id: string;
}) => {
  const bottomRef = useRef<HTMLDivElement>(null);
  const [messageList, setMessageList] = useState(messages);
  // Mutation to mark messages as read
  const markAsReadMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch(
        `/api/${chatType === "dm" ? "dms" : "spaces"}/individual/${id}/isRead`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userId: currentUserId }),
        }
      );
      if (!response.ok) {
        throw new Error("Failed to mark messages as read");
      }
      return response.json();
    },
  });

  // Trigger the mutation when the component mounts or when the id/chatType changes
  useEffect(() => {
    if (currentUserId && id) {
      markAsReadMutation.mutate();
    }
  }, [id, currentUserId]);

  //   useEffect(() => {
  //     pusherClient.subscribe(id);
  //     bottomRef.current?.scrollIntoView();

  //     const messageHandler = (message: Message) => {
  //       setMessageList((current) => {
  //         if (find(current, { id: message.id })) {
  //           return current;
  //         }
  //         console.log(message);
  //         return [...current, message];
  //       });
  //       bottomRef.current?.scrollIntoView();
  //     };
  //     pusherClient.bind("messages:new", messageHandler);

  //     return () => {
  //       pusherClient.unsubscribe(id);
  //       pusherClient.unbind("messages:new", messageHandler);
  //     };
  //   }, [id]);
  return (
    <div className="flex-1 overflow-auto px-4 min-h-0">
      <div className="flex flex-col justify-end min-h-full ">
        {currentUserId &&
          messageList.map((msg, i) => {
            console.log(msg);
            return (
              <MessageBox
                key={msg.id}
                chatType={chatType}
                isLast={i === messageList.length - 1}
                msg={msg}
                currentUserId={currentUserId}
              />
            );
          })}
      </div>
      <div ref={bottomRef} />
    </div>
  );
};

export default MessageBody;
