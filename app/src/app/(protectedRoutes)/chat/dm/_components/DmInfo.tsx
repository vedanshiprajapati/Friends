import React from "react";
import { X, Image as ImageIcon, AtSign, CircleCheckBig } from "lucide-react";
import { useState } from "react";
import { otherUser } from "@/app/types/user";
import { dmMessageType } from "@/app/types/dm";
import Image from "next/image";

const DmInfo = ({
  data,
  onClose,
}: {
  data: { otherUser: otherUser; messages: dmMessageType[] };
  onClose: () => void;
}) => {
  const otherUser = data.otherUser;
  const [copied, setCopied] = useState(false);

  const handleCopyUsername = async () => {
    try {
      await navigator.clipboard.writeText(otherUser.username);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy username");
    }
  };

  return (
    <div className="w-full h-full flex flex-col border-l border-lavender overflow-y-auto">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-lavender">
        <h2 className="text-xl font-semibold">User Info</h2>
        <button
          onClick={onClose}
          className="p-2 hover:bg-gray-100 rounded-full"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Space Info */}
      <div className="p-4 border-b border-lavender">
        <div className="w-full aspect-square shadow-sm rounded-lg flex items-center justify-center mb-4">
          {data.otherUser.image && (
            <Image
              src={data.otherUser.image}
              className="border-0 w-full"
              alt="Avatar"
              width={100}
              height={100}
            />
          )}
        </div>
        <h3 className="text-2xl font-bold mb-1">{data.otherUser.name}</h3>

        {/* Invite Link */}
        <div
          className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg mb-3 cursor-pointer"
          onClick={() => handleCopyUsername()}
        >
          <div className="relative w-5 h-5">
            <AtSign
              className={`absolute w-5 h-5 text-gray-600 transition-opacity duration-300 ${
                copied ? "opacity-0" : "opacity-100"
              }`}
            />
            <CircleCheckBig
              className={`absolute w-5 h-5 text-green-400 transition-opacity duration-300 ${
                copied ? "opacity-100" : "opacity-0"
              }`}
            />
          </div>
          <div className="flex-1 overflow-hidden">
            <p className="text-sm font-medium">Username</p>
            <p className="text-xs text-gray-500 truncate">
              @{data.otherUser.username}
            </p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-lavender">
        <div className="flex-1 p-2 text-sm font-medium border-b-2 border-purple-600 text-purple-600">
          <div className="flex items-center justify-center gap-2">
            <ImageIcon className="w-4 h-4" />
            <span>Media</span>
          </div>
        </div>
      </div>

      {/* Tab Content */}
      <div className="flex-1">
        {
          <div className="p-4 grid grid-cols-3 gap-1">
            {data.messages
              .filter((msg: dmMessageType) => msg.image)
              .map((msg: dmMessageType) => {
                return (
                  <div
                    key={msg.id}
                    className="aspect-square bg-gray-100 rounded-lg overflow-hidden"
                  >
                    {msg.image && (
                      <Image
                        src={msg.image}
                        width={100}
                        height={100}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>
                );
              })}
          </div>
        }
      </div>
    </div>
  );
};

export default DmInfo;
