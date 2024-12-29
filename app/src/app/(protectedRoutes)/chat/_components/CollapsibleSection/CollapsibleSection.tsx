"use client";

import { ChevronRight } from "lucide-react";
import { useState } from "react";

export const CollapsibleSection = ({ title, children }: any) => {
  const [isOpen, setIsOpen] = useState(true);
  return (
    <div className="mb-2 hover:bg-lightPurple2">
      <div
        className="flex items-center p-2 cursor-pointer text-deepPurple"
        onClick={() => setIsOpen(!isOpen)}
      >
        <ChevronRight
          size={20}
          className={`transform transition-transform ${
            isOpen ? "rotate-90" : ""
          }`}
        />
        <span className="ml-3 text-base font-extrabold">{title}</span>
      </div>
      {isOpen && <div className="ml-2">{children}</div>}
    </div>
  );
};
