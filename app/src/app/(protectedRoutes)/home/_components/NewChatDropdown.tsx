import React, { useState } from "react";

const NewChatDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        className="bg-purple text-cream px-4 py-2 rounded"
        onClick={() => setIsOpen(!isOpen)}
      >
        New Chat
      </button>
      {isOpen && (
        <div className="absolute top-10 left-0 bg-cream border border-lavender p-2 w-48">
          <div className="text-deepPurple cursor-pointer">Add People</div>
          <div className="text-deepPurple cursor-pointer">Create Space</div>
        </div>
      )}
    </div>
  );
};

export default NewChatDropdown;
