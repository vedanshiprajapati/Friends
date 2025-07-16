import { useRouter } from "next/router";
import DmChatBox from "../_components/DmChatBox";

interface Iparams {
  conversationId: string;
}

export default async function () {
  const router = useRouter();
  const conversationId = router.query.slug as string;
  console.log(conversationId, "/dm/[id]: conversationID");
  if (!conversationId) {
    return <p>not valid conversation page!</p>;
  }

  return <DmChatBox id={conversationId} />;
}
