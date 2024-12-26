// import { auth, signOut } from "@/auth";

// export default async function () {
//   const session = await auth();

//   return (
//     <div>
//       <div>
//         This is where user is being redirecteddddd after being signed in!
//       </div>
//       <div>{JSON.stringify(session)}</div>

//       <form
//         action={async () => {
//           "use server";

//           await signOut();
//         }}
//       >
//         <button type="submit">Signout</button>
//       </form>
//     </div>
//   );
// }

import React from "react";
import ChatHeader from "./_components/ChatHeader";
import ChatSidebar from "./_components/ChatSidebar";
import ChatMain from "./_components/ChatMain";

const ChatHomePage = () => {
  return (
    <div className="flex flex-col h-screen">
      <ChatHeader />
      <div className="flex flex-1">
        <ChatSidebar />
        <ChatMain />
      </div>
    </div>
  );
};

export default ChatHomePage;
