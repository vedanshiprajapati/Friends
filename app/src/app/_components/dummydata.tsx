interface ChatUser {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  status?: "online" | "offline" | "away";
  lastSeen?: string;
}

interface Message {
  id: string;
  sender: ChatUser;
  content: string;
  timestamp: string;
  reactions?: Array<{ emoji: string; count: number }>;
  isDeleted?: boolean;
  attachments?: Array<{ type: "image" | "file"; url: string; name: string }>;
}

interface Chat {
  id: string;
  type: "direct" | "space";
  name: string;
  participants: ChatUser[];
  lastMessage?: Message;
  unreadCount?: number;
  createdDate: string;
  description?: string;
  isStarred?: boolean;
  isPinned?: boolean;
  category?: string; // for organizing spaces
}

// Dummy Users
const dummyUsers: ChatUser[] = [
  {
    id: "u1",
    name: "Rachel Green",
    email: "rachel.green@friends.com",
    status: "online",
  },
  {
    id: "u2",
    name: "Monica Geller",
    email: "monica.geller@friends.com",
    status: "away",
    lastSeen: "2 hours ago",
  },
  {
    id: "u3",
    name: "Phoebe Buffay",
    email: "phoebe.buffay@friends.com",
    status: "offline",
    lastSeen: "1 day ago",
  },
  {
    id: "u4",
    name: "Joey Tribbiani",
    email: "joey.tribbiani@friends.com",
    status: "online",
  },
  {
    id: "u5",
    name: "Chandler Bing",
    email: "chandler.bing@friends.com",
    status: "online",
  },
  {
    id: "u6",
    name: "Ross Geller",
    email: "ross.geller@friends.com",
    status: "away",
    lastSeen: "30 minutes ago",
  },
];

// Dummy Chats
export const dummyChats: Chat[] = [
  // Direct Messages
  {
    id: "dm1",
    type: "direct",
    name: "Rachel Green",
    participants: [dummyUsers[0]],
    lastMessage: {
      id: "m1",
      sender: dummyUsers[0],
      content: "Hey, want to grab coffee at Central Perk?",
      timestamp: "10:30 AM",
      reactions: [
        { emoji: "👍", count: 1 },
        { emoji: "☕", count: 2 },
      ],
    },
    unreadCount: 3,
    createdDate: "December 15, 2024",
    isStarred: true,
  },
  {
    id: "dm2",
    type: "direct",
    name: "Monica Geller",
    participants: [dummyUsers[1]],
    lastMessage: {
      id: "m2",
      sender: dummyUsers[1],
      content: "I'm hosting dinner tonight, don't be late!",
      timestamp: "Yesterday",
    },
    createdDate: "December 10, 2024",
  },

  // Spaces (Group Chats)
  {
    id: "sp1",
    type: "space",
    name: "Central Perk Squad",
    participants: dummyUsers,
    lastMessage: {
      id: "m3",
      sender: dummyUsers[3],
      content: "How you doin'?",
      timestamp: "2:15 PM",
      reactions: [
        { emoji: "😂", count: 4 },
        { emoji: "👋", count: 2 },
      ],
    },
    unreadCount: 5,
    createdDate: "December 1, 2024",
    description: "The one with all the coffee",
    isPinned: true,
    category: "Favorites",
  },
  {
    id: "sp2",
    type: "space",
    name: "Apartment 20",
    participants: [dummyUsers[0], dummyUsers[1], dummyUsers[4]],
    lastMessage: {
      id: "m4",
      sender: dummyUsers[4],
      content: "Could this BE any more fun?",
      timestamp: "1 hour ago",
    },
    createdDate: "December 5, 2024",
    description: "Monica's apartment group",
    category: "Apartments",
  },
  {
    id: "sp3",
    type: "space",
    name: "FRIENDS Forever",
    participants: dummyUsers,
    lastMessage: {
      id: "m5",
      sender: dummyUsers[2],
      content: "Smelly Cat, Smelly Cat... 🎸",
      timestamp: "4:20 PM",
      reactions: [
        { emoji: "🎵", count: 6 },
        { emoji: "😺", count: 3 },
      ],
    },
    createdDate: "November 30, 2024",
    description: "Main group for all things Friends",
    isPinned: true,
    category: "General",
  },
];

// Function to get chat by ID
export const getChatById = (chatId: string): Chat | undefined => {
  return dummyChats.find((chat) => chat.id === chatId);
};

// Function to get recent chats
export const getRecentChats = (limit: number = 5): Chat[] => {
  return dummyChats
    .sort((a, b) => {
      const aTime = a.lastMessage?.timestamp || "";
      const bTime = b.lastMessage?.timestamp || "";
      return bTime.localeCompare(aTime);
    })
    .slice(0, limit);
};

// Function to get chats by type
export const getChatsByType = (type: "direct" | "space"): Chat[] => {
  return dummyChats.filter((chat) => chat.type === type);
};
