import { createClient } from "@supabase/supabase-js";
import { getSession } from "next-auth/react";

export const postDmMessage = async (
  content: string,
  id: string,
  image?: string
) => {
  try {
    const response = await fetch("/api/dms/message", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ content, image, conversationId: id }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to send DM message");
    }

    return response.json(); // Return the response data
  } catch (error: any) {
    console.error("Error posting DM message:", error.message);
    throw error; // Let useMutation handle the error
  }
};
export const postDmImage = async (
  image: string,
  id: string,
  chatType: "dm" | "space"
) => {
  try {
    const content = "";
    const route = chatType === "dm" ? "dms" : "spaces";
    const body =
      chatType === "dm"
        ? { content, image, conversationId: id }
        : { content, image, spaceId: id };

    const response = await fetch(`/api/${route}/message`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to send DM image");
    }

    return response.json(); // Return the response data
  } catch (error: any) {
    console.error("Error posting DM message:", error.message);
    throw error; // Let useMutation handle the error
  }
};
// Function to post a Space message
export const postSpaceMessage = async (
  content: string,
  id: string,
  image?: string
) => {
  try {
    const response = await fetch("/api/spaces/message", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ content, image, spaceId: id }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to send Space message");
    }

    return response.json(); // Return the response data
  } catch (error: any) {
    console.error("Error posting Space message:", error.message);
    throw error; // Let useMutation handle the error
  }
};
