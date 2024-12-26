import { useParams } from "next/navigation";
import { useMemo } from "react";

const useConversation = () => {
  const params = useParams();

  const conversationId = useMemo(() => {
    return params?.conversationId || "";
  }, [params?.conversationId]);

  const isConversationOpen = useMemo(() => !!conversationId, [conversationId]);

  return {
    conversationId,
    isConversationOpen,
  };
};

export default useConversation;
