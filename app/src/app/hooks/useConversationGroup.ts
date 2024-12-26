import useConversation from "@/app/hooks/useConversation";
import useGroup from "@/app/hooks/useGroup";

const useConversationGroup = () => {
  const { conversationId, isConversationOpen } = useConversation();
  const { groupId, isGroupOpen } = useGroup();

  const isOpen = isConversationOpen && isGroupOpen;

  return {
    conversationId,
    groupId,
    isConversationOpen,
    isGroupOpen,
    isOpen,
  };
};

export default useConversationGroup;
