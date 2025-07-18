import { CollapsibleSection } from "@/app/(protectedRoutes)/chat/_components/CollapsibleSection/CollapsibleSection";
import { getBasicDmdata } from "@/app/_actions/getBasicDmData";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/app/_components/ui/Avatar";
import { DEFAULT_PROFILE_IMAGE } from "@/app/_data/constants";
import { useQuery } from "@tanstack/react-query";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export const DmCollapsibleSection = () => {
  const route = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { data, isLoading, isError } = useQuery({
    queryFn: async () => await getBasicDmdata(),
    queryKey: ["BasicDmData"],
  });

  const handleClick = (id: string) => {
    const params = new URLSearchParams(searchParams);
    params.delete("spaceId");
    params.set("conversationId", id);
    route.push(`/chat/dm?${params.toString()}`);
  };
  return (
    <div>
      <CollapsibleSection title="Direct messages">
        {isLoading &&
          [1, 2, 3].map((item) => (
            <div
              key={item}
              className="w-full h-8 flex items-center pl-5  rounded-lg"
            >
              <div className="w-6 h-6 rounded-full bg-lightPurple1 animate-pulse mr-2"></div>
              <div className="animate-pulse bg-lightPurple1 rounded-full h-5 w-1/2"></div>
            </div>
          ))}
        {isError && <p>Errorrr</p>}
        {data &&
          data.map((item) => (
            <div
              key={item.id}
              className={`pl-6 py-2 cursor-pointer text-sm flex items-center text-deepPurple rounded-full ${
                pathname.includes(item.id) ? "bg-purple" : "hover:bg-[#e5cef5]"
              }`}
              onClick={() => handleClick(item.id)}
            >
              <Avatar className="w-6 h-6 mr-2">
                {item.user && (
                  <AvatarImage
                    src={
                      item?.user.image
                        ? item?.user.image
                        : DEFAULT_PROFILE_IMAGE
                    }
                    alt={item.user.name || "avatar"}
                  />
                )}
              </Avatar>
              <div className="">{item.user?.name || "Unknown User"}</div>
            </div>
          ))}
      </CollapsibleSection>
    </div>
  );
};
