"use client";

import React, { useState, useRef, useEffect, useMemo } from "react";
import { LogOut, User, Settings } from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

interface AvatarDropdownProps {
  className?: string;
  size?: "sm" | "md" | "lg";
  position?: "left" | "right";
}

const AvatarDropdown: React.FC<AvatarDropdownProps> = ({
  className = "",
  size = "md",
  position = "right",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const session = useSession();
  const src = session.data?.user.image;
  const route = useRouter();
  const searchParams = useSearchParams();
  const showProfile = searchParams.get("editProfile") === "true";

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

  const handleManageAccount = () => {
    const params = new URLSearchParams(searchParams);
    if (showProfile) {
      params.delete("editProfile");
    } else {
      params.set("editProfile", "true");
    }
    route.push(`${window.location.pathname}?${params.toString()}`);
    setIsOpen(false);
  };

  const handleLogout = async () => {
    await signOut();
    window.location.reload();
    setIsOpen(false);
  };

  return (
    <div className="relative inline-block" ref={dropdownRef}>
      <div
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center space-x-2 focus:outline-none ${className}`}
      >
        <div
          className={`relative ${sizeClasses[size]} rounded-full text-deepPurple flex items-center justify-center overflow-hidden shadow-xl`}
        >
          {src ? (
            <img
              src={src}
              className="w-full h-full object-cover rounded-full border-0 shadow-md"
            />
          ) : (
            <span className="font-medium">
              {session.data?.user.name &&
                session.data?.user.name[0].toUpperCase()}
            </span>
          )}
        </div>
      </div>

      {isOpen && (
        <div
          className={`absolute mt-2 px-2 right-0 w-72 shadow-lg bg-white border border-lavender py-1 z-50`}
        >
          <div className="px-4 py-3 border-b border-lavender">
            <div>
              {src && (
                <img
                  src={src}
                  className="w-full h-full object-cover rounded-full border-0 shadow-md"
                />
              )}
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">
                {session.data?.user.name}
              </p>
              <p className="text-xs text-gray-500">
                {session.data?.user.email}
              </p>
            </div>
          </div>

          <div
            onClick={handleManageAccount}
            className="w-full px-4 py-2 text-sm text-left hover:bg-lightPurple2 flex items-center transition-colors duration-150 cursor-pointer"
          >
            <span className="text-deepPurple pr-3">
              <User size={16} />
            </span>
            <span>Manage your account</span>
          </div>

          <div
            onClick={() => {
              setIsOpen(false);
              route.push("/settings");
            }}
            className="w-full px-4 py-2 text-sm text-left hover:bg-lightPurple2 flex items-center transition-colors duration-150 cursor-pointer"
          >
            <span className="text-deepPurple pr-3">
              <Settings size={16} />
            </span>
            <span>Settings</span>
          </div>

          <div className="my-1 border-t border-lavender" />

          <div
            onClick={handleLogout}
            className="w-full px-4 py-2 text-sm text-left hover:bg-lightPurple2 flex items-center transition-colors duration-15 cursor-pointer"
          >
            <span className="text-deepPurple pr-3">
              <LogOut size={16} />
            </span>
            <span>Logout</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default AvatarDropdown;
