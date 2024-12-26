"use client";
import { LucideIcon } from "lucide-react";
import Link from "next/link";

export const SidebarItem = ({
  icon: Icon,
  label,
  active = false,
  href,
}: {
  icon: LucideIcon;
  label: string;
  active: boolean;
  href: string;
}) => (
  <Link href={href}>
    <div
      className={`flex items-center p-3 rounded-lg cursor-pointer ${
        active ? "bg-purple " : "hover:bg-lightPurple1"
      }`}
    >
      <Icon size={20} className="text-deepPurple" />
      <span className="ml-3 text-sm text-deepPurple">{label}</span>
    </div>
  </Link>
);
