"use client";
import React, { useState } from "react";
import CollapsibleSection from "./CollapsibleSection";
import NewChatDropdown from "./NewChatDropdown";

const ChatSidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className="w-1/4 bg-cream p-4 border-r border-lavender">
      <NewChatDropdown />
      <CollapsibleSection
        title="Direct Messages"
        isCollapsed={isCollapsed}
        onToggle={() => setIsCollapsed(!isCollapsed)}
      >
        {/* Dummy data for direct messages */}
        <div className="p-2">
          <div className="text-deepPurple">Vedanshi V</div>
          <div className="text-deepPurple">umeshia.gr/19gmail.com</div>
        </div>
      </CollapsibleSection>
      <CollapsibleSection
        title="Spaces"
        isCollapsed={isCollapsed}
        onToggle={() => setIsCollapsed(!isCollapsed)}
      >
        {/* Dummy data for spaces */}
        <div className="p-2">
          <div className="text-deepPurple">Friends</div>
          <div className="text-deepPurple">Browse spaces</div>
        </div>
      </CollapsibleSection>
    </div>
  );
};

export default ChatSidebar;
