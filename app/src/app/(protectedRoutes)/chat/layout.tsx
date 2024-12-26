import { ReactNode } from "react";
import ChatHome from "./_components/ChatHome";

export default function ({ children }: { children: ReactNode }) {
  return (
    <div>
      <ChatHome>{children}</ChatHome>
    </div>
  );
}
