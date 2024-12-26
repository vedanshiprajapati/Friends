import { useParams } from "next/navigation";
import { useMemo } from "react";

const useGroup = () => {
  const params = useParams();

  const groupId = useMemo(() => {
    return params?.groupId || "";
  }, [params?.groupId]);

  const isGroupOpen = useMemo(() => !!groupId, [groupId]);

  return {
    groupId,
    isGroupOpen,
  };
};

export default useGroup;
