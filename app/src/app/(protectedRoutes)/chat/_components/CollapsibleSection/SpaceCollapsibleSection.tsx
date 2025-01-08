import { CollapsibleSection } from "@/app/(protectedRoutes)/chat/_components/CollapsibleSection/CollapsibleSection";
import { getBasicSpaceData } from "@/app/_actions/getBasicSpaceData";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/app/_components/ui/Avatar";
import { useQuery } from "@tanstack/react-query";
import { usePathname, useRouter } from "next/navigation";

export const SpaceCollapsibleSection = () => {
  const route = useRouter();
  const pathname = usePathname();
  const { data, isLoading } = useQuery({
    queryKey: ["BasicSpaceData"],
    queryFn: async () => await getBasicSpaceData(),
  });
  const handleClick = (id: string) => {
    route.push(`/chat/space/${id}`);
  };
  return (
    <div>
      <CollapsibleSection title="Spaces">
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
        {data &&
          data.map((item) => (
            <div
              key={item.id}
              className={`pl-6 py-2 cursor-pointer text-sm flex items-center text-deepPurple  rounded-full ${
                pathname.includes(item.id) ? "bg-purple" : "hover:bg-[#e5cef5]"
              }
              `}
              onClick={() => handleClick(item.id)}
            >
              <Avatar className="w-6 h-6 mr-2">
                {/* {item.user && item.user.image && (
                  <AvatarImage
                    src={item?.user.image}
                    alt={item.user.name || "avatar"}
                  />
                )} */}
                <AvatarFallback>
                  {item.name && item.name[0].toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>{item.name}</div>
            </div>
          ))}
      </CollapsibleSection>
    </div>
  );
};
