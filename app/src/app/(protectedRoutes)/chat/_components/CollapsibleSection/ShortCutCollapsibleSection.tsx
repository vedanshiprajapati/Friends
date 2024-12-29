"use client";

import { CollapsibleSection } from "@/app/(protectedRoutes)/chat/_components/CollapsibleSection/CollapsibleSection";
import { SidebarItem } from "@/app/(protectedRoutes)/chat/_components/SidebarItem";
import useRoutes from "@/app/hooks/useRoutes";

export const ShortCutCollapsibleSection = () => {
  const routes = useRoutes();
  return (
    <CollapsibleSection title="shortcuts">
      {routes.map((item) => {
        return (
          <SidebarItem
            key={item.href}
            icon={item.icon}
            label={item.label}
            active={item.active}
            href={item.href}
          />
        );
      })}
    </CollapsibleSection>
  );
};
