import { CollapsibleSection } from "@/app/(protectedRoutes)/chat/_components/CollapsibleSection/CollapsibleSection";
import { getBasicDmdata } from "@/app/_actions/getBasicDmData";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

export const DmCollapsibleSection = () => {
  const route = useRouter();

  const { data, isLoading, isError } = useQuery({
    queryFn: async () => await getBasicDmdata(),
    queryKey: ["BasicDmData"],
  });

  const handleClick = (id: string) => {
    route.push(`/chat/dm/${id}`);
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
              className="pl-6 py-2 cursor-pointer text-sm flex items-center text-deepPurple hover:bg-[#e5cef5] rounded-full"
              onClick={() => handleClick(item.id)}
            >
              <div className="w-6 h-6 rounded-full bg-deepPurple text-cream mr-2 flex items-center justify-center">
                {item.user?.name?.[0]?.toUpperCase() || "?"}
              </div>
              <div className="">{item.user?.name || "Unknown User"}</div>
            </div>
          ))}
      </CollapsibleSection>
    </div>
  );
};
