import DmChatBox from "../_components/DmChatBox";

interface Iparams {
  conversationId: string;
}

export default async function ({ params }: { params: Promise<Iparams> }) {
  const { conversationId } = await params;
  if (!conversationId) {
    return <p>not valid conversation page!</p>;
  }

  return <DmChatBox id={conversationId} />;
}
