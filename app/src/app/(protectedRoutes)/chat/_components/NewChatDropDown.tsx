"use client";
import { useState, useRef, useEffect, ReactNode } from "react";
import {
  LucideIcon,
  MessageCirclePlus,
  MessageSquare,
  Plus,
  Users,
} from "lucide-react";

export const NewChatDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  // Close dropdown when clicking outside
  const handleClickOutside = (event: MouseEvent) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target as Node)
    ) {
      setIsOpen(false);
    }
  };

  // Add event listener to close dropdown on outside click
  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative inline-block">
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex items-center space-x-2 px-4 py-2 rounded-full border border-lavender hover:bg-lightPurple2 w-full text-deepPurple"
      >
        <Plus size={20} />
        <span>New chat</span>
      </button>

      {/* Dropdown Menu */}

      {/* <div
              className="p-2 hover:bg-lightPurple2 rounded cursor-pointer flex items-center"
              onClick={() => {
                setIsOpen(false); // Close the dropdown
                console.log("Add one or more people clicked");
              }}
            >
              <MessageSquare size={18} className="text-deepPurple" />
              <span className="ml-2 text-sm">Add one or more people</span>
            </div>
            <div
              className="p-2 hover:bg-lightPurple2 rounded cursor-pointer flex items-center"
              onClick={() => {
                setIsOpen(false); // Close the dropdown
                console.log("Create a space clicked");
              }}
            >
              <Users size={18} className="text-deepPurple" />
              <span className="ml-2 text-sm">Create a space</span>
            </div> */}
      {isOpen && (
        <div
          ref={dropdownRef}
          className="absolute top-0 w-64 left-full ml-2 bg-white border border-lavender z-1 text-deepPurple"
        >
          <div className="p-2">
            {DropdownOptions.map((item) => {
              return (
                <DropdownItem
                  title={item.title}
                  icon={item.icon}
                  key={item.title}
                />
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

const DropdownOptions = [
  {
    icon: MessageSquare,
    title: "Add one or more people",
    onClick: () => {
      console.log("Add one or more people");
    },
  },
  {
    icon: Users,
    title: "Create a space",
    onClick: () => {
      console.log("Add one or more people");
    },
  },
  {
    icon: MessageCirclePlus,
    title: "New message Requests",
    onClick: () => {
      console.log("Add one or more people");
    },
  },
];

const DropdownItem = ({
  icon: Icon,
  title,
  onClick,
}: {
  icon: LucideIcon;
  title: string;
  onClick?: () => {};
}) => {
  return (
    <div className="p-2 hover:bg-lightPurple2 rounded cursor-pointer flex items-center">
      <Icon size={18} className="text-deepPurple" />
      <span className="ml-2 text-sm">{title}</span>
    </div>
  );
};
