import { useState } from "react";
import { X, Users, Image as ImageIcon } from "lucide-react";
import InviteCodeCard from "./InviteCodeCard";
import { Space } from "@/app/types/space";
import Image from "next/image";

const SpaceInfo = ({ space, onClose }: { space: any; onClose: () => void }) => {
  const [activeTab, setActiveTab] = useState("members");

  return (
    <div className="w-full h-full flex flex-col border-l border-lavender overflow-y-auto">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-lavender">
        <h2 className="text-xl font-semibold">Space Info</h2>
        <button
          onClick={onClose}
          className="p-2 hover:bg-gray-100 rounded-full"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Space Info */}
      <div className="p-4 border-b border-lavender">
        <div className="w-full aspect-square  rounded-lg shadow-lg flex items-center justify-center mb-4">
          <Image
            src={`/group-image.png`}
            className="border-0  w-full"
            alt="avatar"
            width={100}
            height={100}
          />
        </div>
        <h3 className="text-2xl font-bold mb-1">{space.name}</h3>
        <p className="text-gray-600 mb-4">{space.description}</p>

        {/* Invite Link */}
        <InviteCodeCard inviteCode={space.inviteCode} />
      </div>

      {/* Tabs */}
      <div className="flex border-b border-lavender">
        <button
          className={`flex-1 p-2 text-sm font-medium border-b-2 ${
            activeTab === "members"
              ? "border-purple-600 text-purple-600"
              : "border-transparent text-gray-600"
          }`}
          onClick={() => setActiveTab("members")}
        >
          <div className="flex items-center justify-center gap-2">
            <Users className="w-4 h-4" />
            <span>Members</span>
          </div>
        </button>
        <button
          className={`flex-1 p-2 text-sm font-medium border-b-2 ${
            activeTab === "media"
              ? "border-purple-600 text-purple-600"
              : "border-transparent text-gray-600"
          }`}
          onClick={() => setActiveTab("media")}
        >
          <div className="flex items-center justify-center gap-2">
            <ImageIcon className="w-4 h-4" />
            <span>Media</span>
          </div>
        </button>
      </div>

      {/* Tab Content */}
      <div className="flex-1">
        {activeTab === "members" && (
          <div className="p-4">
            <p className="text-sm text-gray-500 mb-4">
              {space.members.length} members
            </p>
            {space.members.map((member: any) => (
              <div
                key={member.id}
                className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg"
              >
                <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                  {member.user.image ? (
                    <Image
                      src={member.user.image}
                      width={100}
                      height={100}
                      alt={member.user.name}
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    <span className="text-gray-600">
                      {member.user.name[0].toUpperCase()}
                    </span>
                  )}
                </div>
                <div className="flex-1">
                  <p className="font-medium">{member.user.name}</p>
                  <p className="text-sm text-gray-500">
                    @{member.user.username}
                  </p>
                </div>
                <span className="text-xs font-medium px-2 py-1 bg-purple-100 text-purple-600 rounded-full">
                  {member.role}
                </span>
              </div>
            ))}
          </div>
        )}
        {activeTab === "media" && (
          <div className="p-4 grid grid-cols-3 gap-1">
            {space.messages
              .filter((msg: any) => msg.image)
              .map((msg: any) => (
                <div
                  key={msg}
                  className="aspect-square bg-gray-100 rounded-lg overflow-hidden"
                >
                  <Image
                    src={msg.image}
                    height={100}
                    width={100}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SpaceInfo;
