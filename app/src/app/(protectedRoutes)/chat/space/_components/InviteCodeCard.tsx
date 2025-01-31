"use client";
import { CircleCheckBig, Copy, CopyCheck, Link } from "lucide-react";
import { useState } from "react";

const InviteCodeCard = ({ inviteCode }: { inviteCode: string }) => {
  const [isCheck, setIsCheck] = useState(false);

  const handleCopyClick = (inviteCode: string) => {
    const inviteLink = `https://yourapp.com/invite/${inviteCode}`;
    navigator.clipboard
      .writeText(inviteLink)
      .then(() => {
        setIsCheck(true);
        setTimeout(() => setIsCheck(false), 1000);
      })
      .catch((err) => {
        console.error("Failed to copy text: ", err);
      });
  };

  return (
    <div
      className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg mb-3 cursor-pointer"
      onClick={() => handleCopyClick(inviteCode)}
    >
      <div className="relative w-5 h-5">
        <Copy
          className={`absolute w-5 h-5 text-gray-600 transition-opacity duration-300 ${
            isCheck ? "opacity-0" : "opacity-100"
          }`}
        />
        <CopyCheck
          className={`absolute w-5 h-5 text-green-400 transition-opacity duration-300 ${
            isCheck ? "opacity-100" : "opacity-0"
          }`}
        />
      </div>
      <div className="flex-1 overflow-hidden">
        <p className="text-sm font-medium">Invite Code</p>
        <p className="text-xs text-gray-500 truncate">{inviteCode}</p>
      </div>
    </div>
  );
};

export default InviteCodeCard;
