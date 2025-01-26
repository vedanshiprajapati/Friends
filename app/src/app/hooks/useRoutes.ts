import { usePathname } from "next/navigation";

import useConversationGroup from "./useConversationGroup";
import { useMemo } from "react";
import { AtSign, Compass, Home, Star } from "lucide-react";

const useRoutes = () => {
  const pathname = usePathname();

  const routes = useMemo(
    () => [
      {
        label: "Home",
        icon: Home,
        href: "/chat/home",
        active: pathname === "/chat/home",
      },
      {
        label: "Explore",
        icon: Compass,
        href: "/chat/explore",
        active: pathname === "/chat/explore",
      },
      // {
      //   label: "Mentions",
      //   icon: AtSign,
      //   href: "/chat/mentions",
      //   active: pathname === "/chat/mentions",
      // },
      // {
      //   label: "Starred",
      //   icon: Star,
      //   href: "/chat/starred",
      //   active: pathname === "/chat/starred",
      // },
    ],
    [pathname]
  );

  return routes;
};

export default useRoutes;
