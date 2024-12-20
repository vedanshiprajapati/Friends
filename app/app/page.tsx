import Image from "next/image";
import FriendsLandingPage from "./_components/FriendsLandingPage";
import { db } from "./lib/db";

export default function Home() {
  const user = db.user;
  return (
    <div>
      <FriendsLandingPage />
    </div>
  );
}
