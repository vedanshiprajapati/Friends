"use client";

import EmojiPicker from "emoji-picker-react";
import { Image, Send, Smile } from "lucide-react";
import { CldUploadButton } from "next-cloudinary";
import { useState } from "react";

export const MessageInput = () => {
  const [message, setMessage] = useState("");
  const [ShowEmojiPicker, setShowEmojiPicker] = useState(false);

  return (
    <div className="bg-white border-t border-lavender p-4">
      <form>
        <div className="flex items-center bg-purple/5 rounded-lg ">
          <CldUploadButton
            options={{ maxFiles: 1 }}
            onUploadAddedAction={() => {}}
            uploadPreset="friendsChat"
            className="p-2 hover:bg-purple/10 rounded-full mr-2"
          >
            <Image size={20} className="text-deepPurple" />
          </CldUploadButton>
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Message"
            className="flex-1 px-4 py-2 bg-transparent focus:outline-none rounded-full"
          />
          <div className="flex items-center space-x-2 px-2 border-none">
            <button className="p-2 hover:bg-purple/10 rounded-full">
              <Smile
                size={20}
                className="text-deepPurple"
                onClick={() => {
                  setShowEmojiPicker(!ShowEmojiPicker);
                }}
              />
            </button>
            <div className="absolute right-5 bottom-24 ">
              {ShowEmojiPicker && (
                <EmojiPicker
                  onEmojiClick={(param) => {
                    console.log(param);
                  }}
                />
              )}
            </div>
            {/* <button className="p-2 hover:bg-purple/10 rounded-full">
              <Mic size={20} className="text-deepPurple" />
            </button> */}
            <button
              className="p-2 hover:bg-purple/10 rounded-full"
              type="submit"
            >
              <Send size={20} className="text-deepPurple" />
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
