import React from "react";
import { format, isToday, isYesterday, differenceInDays } from "date-fns";
import Image from "next/image";
import { Avatar, AvatarImage } from "@/app/_components/ui/Avatar";
import { SPACE_CHARACTER_IMAGE } from "@/app/_data/constants";
import { SpaceMessage } from "@/app/types/space";

interface SpaceMessageBoxProps {
  msg: SpaceMessage;
  currentUserId: string;
  isLast: boolean;
}

const SpaceMessageBox = ({
  msg,
  currentUserId,
  isLast,
}: SpaceMessageBoxProps) => {
  const isOwnMessage = msg.sender.id === currentUserId;

  const formatMessageTime = (messageTime: string) => {
    const date = new Date(messageTime);
    const now = new Date();

    if (isToday(date)) {
      return `Today at ${format(date, "HH:mm a")}`;
    } else if (isYesterday(date)) {
      return `Yesterday at ${format(date, "HH:mm a")}`;
    } else if (differenceInDays(now, date) <= 7) {
      return format(date, "EEEE HH:mm a");
    } else {
      return format(date, "yyyy-MM-dd HH:mm a");
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
        <Avatar className="h-9 w-9">
          <AvatarImage
            src={
              SPACE_CHARACTER_IMAGE.filter(
                (item) => item.name === msg.sender.role
              )[0].avatar
            }
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
            <span className="text-xs text-gray-500">
              {msg.sender.role} {/* Display the sender's role */}
            </span>
            <span className="text-xs text-gray-500">
              {formatMessageTime(msg.createdAt.toString())}
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
          {isLast && isOwnMessage && (
            <div className="text-xs text-gray-500">
              {msg.readBy && msg.readBy.length > 1 ? (
                <div>
                  Seen by{" "}
                  {msg.readBy
                    .slice(1) // Skip the first user
                    .map((user) => user.role)
                    .join(", ")}
                </div>
              ) : (
                "Sent"
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SpaceMessageBox;
