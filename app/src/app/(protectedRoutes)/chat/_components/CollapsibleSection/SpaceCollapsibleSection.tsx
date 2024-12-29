import { CollapsibleSection } from "@/app/(protectedRoutes)/chat/_components/CollapsibleSection/CollapsibleSection";
import { getBasicSpaceData } from "@/app/_actions/getBasicSpaceData";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

export const SpaceCollapsibleSection = () => {
  const route = useRouter();

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
              <div className="animate-pulse bg-lightPurple1 rounded-full h-5 w-1/2"></div>
            </div>
          ))}
        {data &&
          data.map((item) => (
            <div
              key={item.id}
              className="pl-6 py-2 cursor-pointer text-sm text-deepPurple hover:bg-[#e5cef5] rounded-full"
              onClick={() => handleClick(item.id)}
            >
              {item.name}
            </div>
          ))}
      </CollapsibleSection>
    </div>
  );
};
