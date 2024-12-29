import { getIndividualSpace } from "@/app/_actions/getIndividualSpace";
import DynamicChatBox from "../../_components/Chatbox/DynamicChatBox";

interface Iparams {
  spaceId: string;
}

export default function ({ params }: { params: Iparams }) {
  const { spaceId } = params;
  return (
    <DynamicChatBox
      fetchFn={getIndividualSpace}
      chatType="space"
      id={spaceId}
    />
  );
}
