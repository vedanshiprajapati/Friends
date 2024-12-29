import ChatBox from "@/app/(protectedRoutes)/chat/_components/Chatbox/ChatBox";
import DynamicChatBox from "../../_components/Chatbox/DynamicChatBox";
import { getIndividualDm } from "@/app/_actions/getIndividualDm";

interface Iparams {
  conversationId: string;
}

export default function ({ params }: { params: Iparams }) {
  const { conversationId } = params;
  if (!conversationId) {
    return <p>not valid conversation page!</p>;
  }

  return (
    <DynamicChatBox
      id={conversationId}
      fetchFn={getIndividualDm}
      chatType="dm"
    />
  );
}
