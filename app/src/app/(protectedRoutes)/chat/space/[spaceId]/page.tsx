import SpaceChatBox from "@/app/(protectedRoutes)/chat/space/_components/SpaceChatBox";

interface Iparams {
  spaceId: string;
}

export default async function ({ params }: { params: Promise<Iparams> }) {
  const { spaceId } = await params;
  return <SpaceChatBox id={spaceId} />;
}
