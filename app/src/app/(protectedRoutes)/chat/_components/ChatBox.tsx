"use client";
import React, { useState } from "react";
import {
  ArrowLeft,
  ChevronDown,
  Video,
  Search,
  Grid,
  Plus,
  Smile,
  Paperclip,
  Send,
  Clock,
  Check,
  Image,
  Mic,
} from "lucide-react";

interface Message {
  id: string;
  sender: string;
  content: string;
  timestamp: string;
  reactions?: Array<{ emoji: string; count: number }>;
  isDeleted?: boolean;
}

interface ChatBoxProps {
  chatName: string;
  email?: string;
  createdDate?: string;
}

const ChatBox = ({ chatName, email, createdDate }: ChatBoxProps) => {
  const [activeTab, setActiveTab] = useState<"Chat" | "Shared">("Chat");
  const [message, setMessage] = useState("");

  // Dummy messages for demonstration
  const messages: Message[] = [
    {
      id: "1",
      sender: "System",
      content: "Messages sent with the history turned on are saved",
      timestamp: "Thursday, 19 Dec",
    },
    {
      id: "2",
      sender: chatName,
      content: "Message deleted by its author",
      timestamp: "Thu 20:49",
      isDeleted: true,
    },
    {
      id: "3",
      sender: chatName,
      content: "Hii",
      timestamp: "Thu 18:46",
      reactions: [
        { emoji: "😊", count: 1 },
        { emoji: "😄", count: 1 },
        { emoji: "😍", count: 1 },
        { emoji: "😋", count: 1 },
        { emoji: "🎃", count: 1 },
      ],
    },
  ];

  return (
    <div className="flex flex-col h-auto min-w-fit flex-grow central-perk-bg text-black">
      {/* Header */}
      <div className="bg-white border-b border-lavender">
        <div className="flex items-center px-4 h-14">
          <button className="p-2 hover:bg-purple/10 rounded-full">
            <ArrowLeft size={20} className="text-deepPurple" />
          </button>

          <div className="flex items-center ml-2">
            <div className="w-8 h-8 bg-deepPurple rounded-full flex items-center justify-center text-white">
              {chatName[0]}
            </div>
            <div className="ml-2">
              <div className="flex items-center">
                <span className="font-medium">{chatName}</span>
                <ChevronDown size={16} className="ml-1 text-gray-500" />
              </div>
            </div>
          </div>

          <div className="ml-auto flex items-center space-x-4">
            <button className="p-2 hover:bg-purple/10 rounded-full">
              <Video size={20} className="text-deepPurple" />
            </button>
            <button className="p-2 hover:bg-purple/10 rounded-full">
              <Search size={20} className="text-deepPurple" />
            </button>
            <button className="p-2 hover:bg-purple/10 rounded-full">
              <Grid size={20} className="text-deepPurple" />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex px-4">
          {["Chat", "Shared"].map((tab) => (
            <button
              key={tab}
              className={`px-4 py-2 border-b-2 transition-colors ${
                activeTab === tab
                  ? "border-deepPurple text-deepPurple"
                  : "border-transparent text-gray-500 hover:text-deepPurple"
              }`}
              onClick={() => setActiveTab(tab as "Chat" | "Shared")}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Chat Content */}
      <div className="flex-1 overflow-y-auto px-4 py-6 border-x border-purple">
        {/* Chat Info */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-deepPurple rounded-full flex items-center justify-center text-white text-2xl mx-auto mb-4">
            {chatName[0]}
          </div>
          <h2 className="text-xl font-medium mb-1">{chatName}</h2>
          {email && <p className="text-gray-500 text-sm mb-1">{email}</p>}
          {createdDate && (
            <p className="text-gray-500 text-sm">
              You created this chat on {createdDate}
            </p>
          )}
          <div className="flex items-center justify-center mt-4 text-sm text-gray-500">
            <Clock size={16} className="mr-2" />
            <span>HISTORY IS ON</span>
          </div>
          <p className="text-sm text-gray-500 mt-1">
            Messages sent with the history turned on are saved
          </p>
        </div>

        {/* Messages */}
        {messages.map((msg) => (
          <div key={msg.id} className="mb-4">
            {!msg.isDeleted ? (
              <div className="flex items-start">
                <div className="w-8 h-8 bg-deepPurple rounded-full flex items-center justify-center text-white text-sm mr-3">
                  {msg.sender[0]}
                </div>
                <div className="flex-1">
                  <div className="flex items-center">
                    <span className="font-medium">{msg.sender}</span>
                    <span className="text-gray-500 text-sm ml-2">
                      {msg.timestamp}
                    </span>
                  </div>
                  <p className="mt-1">{msg.content}</p>
                  {msg.reactions && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {msg.reactions.map((reaction, idx) => (
                        <span
                          key={idx}
                          className="flex items-center bg-purple/10 rounded-full px-2 py-1 text-sm"
                        >
                          {reaction.emoji} {reaction.count}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex items-center text-gray-500 italic">
                <Check size={16} className="mr-2" />
                {msg.content}
                <span className="ml-2 text-sm">{msg.timestamp}</span>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Message Input */}
      <div className="bg-white border-t border-lavender p-4">
        <div className="flex items-center bg-purple/5 rounded-lg ">
          <button className="p-2 hover:bg-purple/10 rounded-full ml-2">
            <Plus size={20} className="text-deepPurple" />
          </button>
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Message"
            className="flex-1 px-4 py-2 bg-transparent focus:outline-none"
          />
          <div className="flex items-center space-x-2 px-2 border-none">
            <button className="p-2 hover:bg-purple/10 rounded-full">
              <Smile size={20} className="text-deepPurple" />
            </button>
            <button className="p-2 hover:bg-purple/10 rounded-full">
              <Paperclip size={20} className="text-deepPurple" />
            </button>
            <button className="p-2 hover:bg-purple/10 rounded-full">
              <Image size={20} className="text-deepPurple" />
            </button>
            <button className="p-2 hover:bg-purple/10 rounded-full">
              <Mic size={20} className="text-deepPurple" />
            </button>
            <button className="p-2 hover:bg-purple/10 rounded-full">
              <Send size={20} className="text-deepPurple" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatBox;
