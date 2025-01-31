import React from "react";
import { format, isToday, isYesterday, differenceInDays } from "date-fns";
import { Message } from "@/app/types/message";
import Image from "next/image";
import { Avatar, AvatarImage } from "@/app/_components/ui/Avatar";
import { dmMessageType } from "@/app/types/dm";
import { DEFAULT_PROFILE_IMAGE } from "@/app/_data/constants";

interface MessageBoxProps {
  chatType: "dm" | "space";
  msg: dmMessageType;
  currentUserId: string;
  isLast: boolean;
}

const MessageBox = ({
  msg,
  currentUserId,
  isLast,
  chatType,
}: MessageBoxProps) => {
  const isOwnMessage = msg?.sender?.id === currentUserId;

  // Add a check for msg.sender
  if (!msg.sender) {
    return null; // or render a fallback UI
  }

  const formatMessageTime = (messageTime: Date) => {
    const now = new Date();

    if (isToday(messageTime)) {
      return `Today at ${format(messageTime, "HH:mm a")}`;
    } else if (isYesterday(messageTime)) {
      return `Yesterday at ${format(messageTime, "HH:mm a")}`;
    } else if (differenceInDays(now, messageTime) <= 7) {
      return format(messageTime, "EEEE HH:mm a");
    } else {
      return format(messageTime, "dd-MM-yyyy HH:mm a");
    }
  };

  return (
    <div
      className={`flex flex-col mb-4 ${
        isOwnMessage ? "items-end" : "items-start"
      }`}
    >
      <div
        className={`flex items-start gap-3 max-w-2xl ${
          isOwnMessage ? "flex-row-reverse" : "flex-row"
        }`}
      >
        {/* Avatar */}
        <Avatar className="h-8 w-8">
          <AvatarImage
            src={msg.sender.image ? msg.sender.image : DEFAULT_PROFILE_IMAGE}
          />
        </Avatar>
        {/* Message Content */}
        <div
          className={`flex flex-col gap-1 ${
            isOwnMessage ? "items-end" : "items-start"
          }`}
        >
          {/* Header */}
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-gray-800">
              {msg.sender.name || "Unknown"}
            </span>
            <span className="text-xs text-gray-500">
              {formatMessageTime(msg.createdAt)}
            </span>
          </div>

          {/* Message Body */}
          <div
            className={`relative px-4 py-2 rounded-lg ${
              isOwnMessage
                ? "bg-deepPurple text-white"
                : "bg-gray-100 text-gray-800"
            } ${msg.image ? "p-0" : ""}`}
          >
            {msg.image ? (
              <div className="rounded-lg overflow-hidden">
                <Image
                  src={msg.image}
                  alt="message"
                  height={288}
                  width={288}
                  className="object-cover"
                />
              </div>
            ) : (
              <p className="text-sm leading-relaxed break-words">
                {msg.content}
              </p>
            )}
          </div>

          {/* Seen Indicator */}
          {isLast && isOwnMessage && chatType === "dm" && (
            <div className="text-xs text-gray-500">
              {msg.isReadList && msg.isReadList.length > 1 ? "Seen" : "Sent"}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MessageBox;
