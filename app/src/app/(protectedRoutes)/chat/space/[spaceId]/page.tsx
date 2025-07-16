"use client";
import SpaceChatBox from "@/app/(protectedRoutes)/chat/space/_components/SpaceChatBox";
import { useParams } from "next/navigation";
interface Iparams {
  spaceId: string;
}

export default function () {
  const params = useParams();
  const spaceId = params.spaceId as string;

  if (!spaceId) {
    return <p>not valid space page!</p>;
  }

  return <SpaceChatBox id={spaceId} />;
}
