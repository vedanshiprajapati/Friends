import React from "react";

interface ChatMessageProps {
  message: string;
  sender: string;
  timestamp: string;
}

const ChatMessage: React.FC<ChatMessageProps> = ({
  message,
  sender,
  timestamp,
}) => {
  return (
    <div className="bg-lavender p-2 rounded mb-2">
      <div className="text-deepPurple font-semibold">{sender}</div>
      <div className="text-deepPurple">{message}</div>
      <div className="text-xs text-deepPurple">{timestamp}</div>
    </div>
  );
};

export default ChatMessage;
