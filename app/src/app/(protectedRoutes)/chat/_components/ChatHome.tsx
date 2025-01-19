"use client";
import React, { ReactNode, useState } from "react";
import {
  Menu,
  Search,
  Settings,
  HelpCircle,
  MessageCircle,
  User,
  LogOut,
} from "lucide-react";
import { NewSpaceDropdown } from "@/app/(protectedRoutes)/chat/_components/NewSpace/DropDown";
import { SpaceCollapsibleSection } from "@/app/(protectedRoutes)/chat/_components/CollapsibleSection/SpaceCollapsibleSection";
import { DmCollapsibleSection } from "@/app/(protectedRoutes)/chat/_components/CollapsibleSection/DmCollapsibleSection";
import { ShortCutCollapsibleSection } from "@/app/(protectedRoutes)/chat/_components/CollapsibleSection/ShortCutCollapsibleSection";
import { CurrentUserAvatar } from "@/app/_components/CurrentUserAvatar";
import PopUp from "./NewSpace/Popup";
import AvatarDropdown from "./AvatarDropdown";

// Main Component
const ChatHome = ({ children }: { children: ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="flex h-screen bg-lightCream">
      {/* Sidebar */}
      <div className="w-1/5 flex flex-col ">
        {/* New Chat Button */}
        <div className="flex mt-4">
          <Menu
            size={24}
            className="text-deepPurple mx-4 rounded-full cursor-pointer"
          />
          <div className="flex">
            <MessageCircle size={24} color="#674188" className="mr-4" />
            <h1 className="text-xl font-bold m-0" style={{ color: "#674188" }}>
              Friends Chat
            </h1>
          </div>
        </div>
        <div className="p-4">
          <NewSpaceDropdown isPopup={isOpen} setIsPopup={setIsOpen} />
        </div>

        {/* Sidebar Navigation */}
        <div className="flex-1 overflow-y-auto">
          <ShortCutCollapsibleSection />
          <DmCollapsibleSection />
          <SpaceCollapsibleSection />
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="h-16 flex items-center px-4 bg-lightCream">
          <div className="flex-1">
            <div className="max-w-xl">
              <div className="relative">
                <Search
                  size={18}
                  className="absolute left-3 top-2.5 text-gray-400"
                />
                <input
                  type="text"
                  placeholder="Search in chat"
                  className="w-full pl-10 pr-4 py-2 bg-purple/5 rounded-lg border border-lavender focus:outline-none focus:border-purple"
                />
              </div>
            </div>
          </div>

          {/* <form
            action={async () => {
              await signOut();
            }}
          >
            <LogOutIcon
              className="text-deepPurple mx-3"
              type="submit"
            ></LogOutIcon>
          </form> */}
          <div className="flex items-center space-x-4">
            <Settings size={20} className="text-deepPurple cursor-pointer" />
            <HelpCircle size={20} className="text-deepPurple cursor-pointer" />
            <AvatarDropdown />
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 justify-center items-center bg-white rounded-t-2xl">
          {isOpen && <PopUp isOpen onClose={() => setIsOpen(false)} />}
          {/* {selectedChat ? (
            <ChatBox
              chatName={selectedChat.name}
              email={selectedChat.email}
              createdDate={selectedChat.createdDate}
            />
          ) : (
          <div className="flex items-center h-full justify-center text-deepPurple border">
            <div className="text-center">
           
              <h2 className="text-3xl font-bold mb-2">
                Welcome to Friends Chat!
              </h2>
              <p className="text-gray-600">
                Select a conversation or start a new one
              </p>
            </div>
          </div>
          )} */}
          {children}
        </div>
      </div>
    </div>
  );
};

export default ChatHome;
const customItems = [
  { icon: <User size={16} />, label: "My Profile", path: "/profile" },
  { divider: true, label: "divider" },
  { icon: <LogOut size={16} />, label: "Sign Out", onClick: () => {} },
];
