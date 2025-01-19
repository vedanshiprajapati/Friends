// Types for Space and Messages
interface User {
  id: string;
  username: string;
  name: string;
  image: string;
  isPrivate: boolean;
}

interface SpaceMember {
  id: string;
  role: string;
  user: User;
  isAdmin?: boolean;
  joinedAt?: Date;
}

interface SpaceMessage {
  id: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  isEdited: boolean;
  isReadList: string[];
  image?: string;
  spaceId: string;
  spaceMemberId: string;
  taggedRole?: string;
  sender: {
    id: string;
    role: string;
    user: {
      id: string;
      name: string | null;
      username: string;
      image: string | null;
    };
  };
  readBy: {
    id: string;
    role: string;
    user: {
      id: string;
      name: string;
      username: string;
      image: string;
    };
  }[];
}

interface Space {
  id: string;
  name: string;
  image: string;
  description: string;
  inviteCode: string;
  isPrivate: boolean;
  isRandom: boolean;
  creatorId: string;
  members: SpaceMember[];
  messages: SpaceMessage[];
  createdAt: Date;
  updatedAt: Date;
}

interface SpaceResponse {
  status: string;
  message: string;
  data: {
    spaceWithReadBy: Space;
  };
}

export type { User, SpaceMember, SpaceMessage, Space, SpaceResponse };
