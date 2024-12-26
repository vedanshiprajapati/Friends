import React from "react";

const ChatHeader = () => {
  return (
    <div className="bg-deepPurple text-cream p-4 flex justify-between items-center">
      <h1 className="text-2xl font-bold">Chat Application</h1>
      <div className="flex items-center">
        <input
          type="text"
          placeholder="Search in chat"
          className="bg-cream text-deepPurple px-2 py-1 rounded"
        />
      </div>
    </div>
  );
};

export default ChatHeader;
