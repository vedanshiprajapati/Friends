"use client";

import { postDmImage } from "@/app/_data/util";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import EmojiPicker, { EmojiClickData } from "emoji-picker-react";
import { Image, Send, Smile } from "lucide-react";
import { CldUploadButton } from "next-cloudinary";
import { useState, useRef, useEffect } from "react";

interface MessageInputProps {
  chatType: "dm" | "space";
  chatId: string;
  onSendMessage: (content: string, id: string, image?: string) => Promise<any>;
}

export const MessageInput = ({
  chatType,
  chatId,
  onSendMessage,
}: MessageInputProps) => {
  const [message, setMessage] = useState(""); // State for message input
  const [isUploading, setIsUploading] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const emojiPickerRef = useRef<HTMLDivElement>(null);
  const queryClient = useQueryClient();

  // Close emoji picker when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        emojiPickerRef.current &&
        !emojiPickerRef.current.contains(event.target as Node)
      ) {
        setShowEmojiPicker(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const messageMutation = useMutation({
    mutationFn: (content: { text: string; image?: string }) =>
      onSendMessage(content.text, chatId, content.image),
    // onSuccess: () => {
    //   // Invalidate and refetch chat queries
    //   queryClient.invalidateQueries({
    //     queryKey: [
    //       chatType === "dm" ? "IndividualDmData" : "IndividualSpaceData",
    //       chatId,
    //     ],
    //   });
    // },
  });
  const handleSendMessage = async () => {
    if (!message.trim() && !isUploading) return;

    try {
      await messageMutation.mutateAsync({ text: message.trim() });
      setMessage(""); // Reset the message input
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  const handleEmojiClick = (emojiData: EmojiClickData) => {
    setMessage((prev) => prev + emojiData.emoji);
    setShowEmojiPicker(false);
  };

  const handleUpload = async (result: any) => {
    if (!result?.info?.secure_url) {
      alert("Failed to upload the image. Try again!");
      console.log("the result?.info?.secure_url - image url doesnt exist");
      return;
    }
    setIsUploading(true);
    try {
      await postDmImage(result?.info?.secure_url, chatId, chatType);
    } catch (error) {
      console.log(error);
      alert("Failed to upload the image. Try again!");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="bg-white border-t border-lavender p-4">
      {messageMutation.isError && (
        <div className="text-red-500">{messageMutation.error.message} </div>
      )}
      <div className="flex items-center bg-purple/5 rounded-lg relative">
        <CldUploadButton
          options={{ maxFiles: 1 }}
          onSuccess={handleUpload}
          uploadPreset="friendsChat"
          className="p-2 hover:bg-purple/10 rounded-full mr-2"
        >
          <Image
            size={20}
            className={`text-deepPurple ${isUploading ? "opacity-50" : ""}`}
          />
        </CldUploadButton>

        <input
          type="text"
          placeholder={`Message ${chatType === "space" ? "space" : ""}`}
          className="flex-1 px-4 py-2 bg-transparent focus:outline-none rounded-full"
          disabled={messageMutation.isPending || isUploading}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />

        <div className="flex items-center space-x-2 px-2 border-none">
          <button
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            className="p-2 hover:bg-purple/10 rounded-full"
          >
            <Smile size={20} className="text-deepPurple rounded-full" />
          </button>

          {showEmojiPicker && (
            <div
              ref={emojiPickerRef}
              className="absolute right-5 bottom-14 z-50"
            >
              <EmojiPicker
                onEmojiClick={handleEmojiClick}
                width={350}
                height={450}
                skinTonesDisabled
              />
            </div>
          )}

          <button
            className={`p-2 hover:bg-purple/10 rounded-full ${
              (!message.trim() && !isUploading) || messageMutation.isPending
                ? "opacity-50 cursor-not-allowed"
                : ""
            }`}
            onClick={handleSendMessage}
            disabled={
              (!message.trim() && !isUploading) || messageMutation.isPending
            }
          >
            <Send size={20} className="text-deepPurple" />
          </button>
        </div>
      </div>
    </div>
  );
};
