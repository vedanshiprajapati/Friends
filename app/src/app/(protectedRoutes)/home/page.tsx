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

const ChatHomePage = () => {
  return <div className="flex flex-col h-screen"></div>;
};

export default ChatHomePage;
