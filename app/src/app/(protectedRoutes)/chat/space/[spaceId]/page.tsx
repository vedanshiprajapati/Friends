import SpaceChatBox from "@/app/(protectedRoutes)/chat/space/_components/SpaceChatBox";
import { useRouter } from "next/router";

interface Iparams {
  spaceId: string;
}

export default async function () {
  const router = useRouter();
  const spaceId = router.query.slug as string;
  console.log(spaceId, "/space/[id] > SpaceId");
  return <SpaceChatBox id={spaceId} />;
}
