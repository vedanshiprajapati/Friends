"use client";
import SpaceChatBox from "@/app/(protectedRoutes)/chat/space/_components/SpaceChatBox";
import DynamicErrorCard from "@/app/_components/DynamicErrorcard";
import { useSearchParams } from "next/navigation";
interface Iparams {
  spaceId: string;
}

export default function () {
  const searchParams = useSearchParams();
  const spaceId = searchParams.get("spaceId");

  if (!spaceId) {
    return (
      <div className="h-full w-full flex justify-center items-center">
        <DynamicErrorCard message="not valid spacePage" />
      </div>
    );
  }

  return <SpaceChatBox id={spaceId} />;
}
