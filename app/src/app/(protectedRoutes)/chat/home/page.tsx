// /chat/home/page.tsx
import ChatHome from "@/app/(protectedRoutes)/chat/_components/ChatHome";
import ChatBox from "../_components/ChatBox";

export default function HomePage() {
  return (
    <div className="text-black">
      <ChatBox chatName="Vedanshiiii" />
    </div>
  );
}
