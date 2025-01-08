"use client";
import FriendsLandingPage from "@/app/_components/FriendsLandingPage";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Loader from "@/app/_components/Loader";

export default function Home() {
  const session = useSession();
  const router = useRouter();

  useEffect(() => {
    if (session.status === "authenticated") {
      router.push("/chat/home");
    }
  }, [session.status, router]);

  // If the user is authenticated, don't render anything
  if (session.status === "authenticated") {
    return <Loader />;
  }
  console.log(session);
  return (
    <div>{session.status === "unauthenticated" && <FriendsLandingPage />}</div>
  );
}
