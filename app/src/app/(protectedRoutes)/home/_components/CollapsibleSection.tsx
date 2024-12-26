import React from "react";

interface CollapsibleSectionProps {
  title: string;
  isCollapsed: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}

const CollapsibleSection: React.FC<CollapsibleSectionProps> = ({
  title,
  isCollapsed,
  onToggle,
  children,
}) => {
  return (
    <div className="mt-4">
      <div
        className="flex justify-between items-center cursor-pointer"
        onClick={onToggle}
      >
        <h3 className="text-deepPurple font-semibold">{title}</h3>
        <span>{isCollapsed ? "▲" : "▼"}</span>
      </div>
      {!isCollapsed && <div className="mt-2">{children}</div>}
    </div>
  );
};

export default CollapsibleSection;
