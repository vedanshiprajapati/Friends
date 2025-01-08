export interface Message {
  id: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  image?: string;
  isEdited: boolean;
  isReadList: string[];
  readBy?: {
    id: string;
    role: role;
    user: {
      id: string;
      image: string;
      name: string;
      username: string;
    };
  }[];
  senderId: string;
  sender: {
    name: string;
    username: string;
  };
  receiver?: {
    name: string;
    username: string;
  };
}

enum role {
  ROSS,
  JOEY,
  RACHEL,
  CHANDLER,
  MONICA,
  PHEOBE,
}

export interface DmMessage {
  id: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  image?: string;
  isEdited: boolean;
  isReadList: string[];
  senderId: string;
  sender: {
    name: string;
    username: string;
  };
  receiver?: {
    name: string;
    username: string;
  };
}
