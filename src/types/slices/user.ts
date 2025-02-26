export type UserState = {
  uid: string | null;
  displayName: string | null;
  email: string | null;
  photoURL?: string | null;
  description: string | null;
  status: string | null;
  contacts: string[];
  chats: string[];
  isLoading: boolean;
};

export type Chat = {
  participantsDetails?: Participant[];
  id: string;
  lastMessage: string;
  lastMessageTimestamp: number;
};

export type Participant = {
  createdAt?: {toMillis: () => number} | null;
  uid: string;
  displayName: string;
  email: string;
};
