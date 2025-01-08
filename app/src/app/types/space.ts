import { Message } from "./message";
import { otherUser } from "./user";

export interface SpaceMember {
  id: string;
  role: string;
  user: otherUser;
}

export interface Space {
  id: string;
  name: string;
  image: string | null;
  description: string;
  inviteCode: string;
  isPrivate: boolean;
  isRandom: boolean;
  creatorId: string;
  createdAt: Date;
  updatedAt: Date;
  members: SpaceMember[];
  messages: Message[];
}
