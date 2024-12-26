"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  LogOut,
  User,
  Settings,
  Bell,
  HelpCircle,
  ChevronDown,
} from "lucide-react";

interface DropdownItem {
  icon?: React.ReactNode;
  label: string;
  onClick?: () => void;
  path?: string;
  divider?: boolean;
}

interface AvatarDropdownProps {
  src?: string;
  fallback: string;
  items?: DropdownItem[];
  className?: string;
  size?: "sm" | "md" | "lg";
  showArrow?: boolean;
  position?: "left" | "right";
}

const defaultItems: DropdownItem[] = [
  { icon: <User size={16} />, label: "Profile", path: "/profile" },
  { icon: <Settings size={16} />, label: "Settings", path: "/settings" },
  { icon: <Bell size={16} />, label: "Notifications", path: "/notifications" },
  { icon: <HelpCircle size={16} />, label: "Help & Feedback", path: "/help" },
  { divider: true, label: "divider" },
  {
    icon: <LogOut size={16} />,
    label: "Logout",
    onClick: () => console.log("Logout clicked"),
  },
];

const AvatarDropdown: React.FC<AvatarDropdownProps> = ({
  src,
  fallback,
  items = defaultItems,
  className = "",
  size = "md",
  position = "right",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const sizeClasses = {
    sm: "w-8 h-8 text-sm",
    md: "w-10 h-10 text-base",
    lg: "w-12 h-12 text-lg",
  };

  return (
    <div className="relative inline-block" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center space-x-2 focus:outline-none ${className}`}
      >
        <div
          className={`relative ${sizeClasses[size]} rounded-full bg-deepPurple text-white flex items-center justify-center overflow-hidden hover:bg-purple transition-colors duration-200`}
        >
          {src ? (
            <img src={src} className="w-full h-full object-cover" />
          ) : (
            <span className="font-medium">{fallback[0].toUpperCase()}</span>
          )}
        </div>
      </button>

      {isOpen && (
        <div
          className={`absolute mt-2 px-2 right-0 w-60 rounded-lg shadow-lg bg-white border border-lavender py-1 z-50`}
        >
          <div className="px-4 py-3 border-b border-lavender">
            <p className="text-sm font-medium text-gray-900">{fallback}</p>
          </div>

          {items.map((item, index) =>
            item.divider ? (
              <div key={index} className="my-1 border-t border-lavender" />
            ) : (
              <div
                key={index}
                onClick={() => {
                  setIsOpen(false);
                  item.onClick?.();
                }}
                className="w-full px-4 py-2 text-sm text-left hover:bg-lightPurple2 flex items-center transition-colors duration-150 "
              >
                {item.icon && (
                  <span className="text-deepPurple pr-3">{item.icon}</span>
                )}
                <span>{item.label}</span>
              </div>
            )
          )}
        </div>
      )}
    </div>
  );
};

export default AvatarDropdown;
