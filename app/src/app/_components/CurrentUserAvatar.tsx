"use client";
import { useSession } from "next-auth/react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/Avatar";

export const CurrentUserAvatar = () => {
  const session = useSession();
  const user = session.data?.user;
  if (!user) {
    return <div>return</div>;
  }
  return (
    <Avatar>
      {user.image && (
        <AvatarImage src={user.image} alt={user.name || "avatar"} />
      )}
      <AvatarFallback>{user.name && user.name[0].toUpperCase()}</AvatarFallback>
    </Avatar>
  );
};
