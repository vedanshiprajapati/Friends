export interface Message {
  id: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  image: string | null;
  isEdited: boolean;
  isReadList: string[];
  readBy?: {
    id: string;
    role: FriendsRole;
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

export enum FriendsRole {
  ROSS,
  JOEY,
  RACHEL,
  CHANDLER,
  MONICA,
  PHOEBE,
}
