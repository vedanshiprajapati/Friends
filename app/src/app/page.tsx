import FriendsLandingPage from "@/app/_components/FriendsLandingPage";
import { db } from "@/app/lib/db";

export default function Home() {
  const user = db.user;
  return (
    <div>
      <FriendsLandingPage />
    </div>
  );
}
