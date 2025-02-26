import {Chat, Message} from '../firestoreService';

export type ChatState = {
  chats: Record<string, Chat>;
  messages: Record<string, Message[]>;
  error: string | null;
};
