"use client";
import { useParams } from "next/navigation";
import DmChatBox from "../_components/DmChatBox";
interface Iparams {
  conversationId: string;
}

export default function () {
  const params = useParams();
  const conversationId = params.conversationId as string;

  if (!conversationId) {
    return <p>not valid conversation page!</p>;
  }

  return <DmChatBox id={conversationId} />;
}
