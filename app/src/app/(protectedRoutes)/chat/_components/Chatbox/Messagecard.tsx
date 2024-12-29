import React from "react";
import { format, isToday, isYesterday, differenceInDays } from "date-fns";

const MessageBox = ({ msg, currentUserId }: any) => {
  const isOwnMessage = msg.senderId === currentUserId;

  const formatMessageTime = (messageTime: Date) => {
    const now = new Date();

    if (isToday(messageTime)) {
      return `Today at ${format(messageTime, "HH:mm a")}`;
    } else if (isYesterday(messageTime)) {
      return `Yesterday at ${format(messageTime, "HH:mm a")}`;
    } else if (differenceInDays(now, messageTime) <= 7) {
      return format(messageTime, "EEEE HH:mm a");
    } else {
      return format(messageTime, "yyyy-MM-dd HH:mm a");
    }
  };
  return (
    <div
      className={`w-auto max-w-2xl mb-3 ${
        isOwnMessage ? "ml-auto" : "mr-auto"
      }`}
    >
      <div
        className={`flex items-start gap-2.5 ${
          isOwnMessage ? "flex-row-reverse" : "flex-row"
        }`}
      >
        {/* Avatar */}
        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-deepPurple text-xs font-medium text-white self-end">
          {msg.sender.name?.[0]}
        </div>

        {/* Message Content */}
        <div
          className={`flex flex-col ${
            isOwnMessage ? "items-end" : "items-start"
          }`}
        >
          {/* Header */}
          <div
            className={`flex items-center gap-2 mb-1 ${
              isOwnMessage ? "flex-row-reverse" : "flex-row"
            }`}
          >
            <span className="text-sm font-medium text-gray-900">
              {msg.sender.name}
            </span>
            <span className="text-xs text-gray-400">
              {formatMessageTime(msg.createdAt)}
            </span>
          </div>

          {/* Message */}
          <div
            className={`relative px-3.5 py-2 rounded-2xl ${
              isOwnMessage
                ? "bg-deepPurple text-white"
                : "bg-gray-100 text-gray-800"
            }`}
          >
            <p className="text-sm leading-relaxed max-w-xl break-words">
              {msg.content}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessageBox;
