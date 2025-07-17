"use client";
import { useSearchParams } from "next/navigation";
import DmChatBox from "./_components/DmChatBox";
import DynamicErrorCard from "@/app/_components/DynamicErrorcard";
interface Iparams {
  conversationId: string;
}

export default function () {
  const searchParams = useSearchParams();
  const conversationId = searchParams.get("conversationId");

  if (!conversationId) {
    return (
      <div className="h-full w-full flex justify-center items-center">
        <DynamicErrorCard message="Conversation not found" />
      </div>
    );
  }

  return <DmChatBox id={conversationId} />;
}
