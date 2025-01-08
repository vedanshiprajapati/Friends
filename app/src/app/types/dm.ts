export type userType = {
  id: string;
  name: string | null;
  username: string;
  image: string | null;
  isPrivate: boolean;
};

export type detailedDMsType = {
  id: string;
  participants: userType[];
  lastMessage: {
    createdAt: Date;
    content: string;
    isReadList: string[];
    sender: userType;
  };
};
[];

export interface dmMessageType {
  id: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  isEdited: boolean;
  isReadList: string[];
  image: string | null;
  sender: {
    id: string;
    name: string | null;
    username: string;
    image: string | null;
    isPrivate: boolean;
  };
  receiver: {
    id: string;
    name: string | null;
    username: string;
    image: string | null;
    isPrivate: boolean;
  };
}
