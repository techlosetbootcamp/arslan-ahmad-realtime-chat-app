import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AppThunk } from '../store';
import {
  createChat,
  fetchChats,
  sendMessage,
  fetchMessages,
} from '../../services/firebase';

export interface Message {
  id: string;
  senderId: string;
  text: string;
  contentType: 'text' | 'image';
  timestamp: string;
  status: string;
  imageURL?: string;
}

export interface Chat {
  id: string;
  participants: string[];
  lastMessage: string;
  lastActive: string;
  messages: Message[];
  unreadMessages: number;
  notificationStatus: 'allowed' | 'silent';
}

interface ChatState {
  chats: Record<string, Chat>;
  isLoading: boolean;
}

const initialState: ChatState = {
  chats: {},
  isLoading: false,
};

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    setChats(state, action: PayloadAction<Record<string, Chat>>) {
      state.chats = action.payload;
    },
    addChat(state, action: PayloadAction<Partial<Chat> & { id: string }>) {
      const chat = action.payload;
      state.chats[chat.id] = {
        id: chat.id,
        participants: chat.participants || [],
        lastMessage: chat.lastMessage || '',
        lastActive: chat.lastActive || '',
        messages: chat.messages || [],
        unreadMessages: chat.unreadMessages || 0,
        notificationStatus: chat.notificationStatus || 'allowed',
      };
    },
    addMessage(
      state,
      action: PayloadAction<{ chatId: string; message: Message }>
    ) {
      const { chatId, message } = action.payload;

      if (state.chats[chatId]) {
        state.chats[chatId].messages.push(message);
        state.chats[chatId].lastMessage = message.text;
        state.chats[chatId].lastActive = message.timestamp;
      }
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.isLoading = action.payload;
    },
  },
});

export const { setChats, addChat, addMessage, setLoading } = chatSlice.actions;

// Thunk to fetch chats for the user
export const fetchUserChats = (userId: string): AppThunk => async dispatch => {
  dispatch(setLoading(true));

  const chats = await fetchChats(userId); // Fetch chats from Firebase
  const chatMap = chats.reduce((acc, chat) => {
    acc[chat.id] = {
      ...chat,
      messages: [], // You can load messages separately if needed
      unreadMessages: chat.unreadMessages || 0,
      notificationStatus: chat.notificationStatus || 'allowed',
    };
    return acc;
  }, {} as Record<string, Chat>);

  dispatch(setChats(chatMap));
  dispatch(setLoading(false));
};

export const createNewChat = (
  chatId: string,
  participants: string[]
): AppThunk => async dispatch => {
  await createChat(chatId, participants);
  dispatch(fetchUserChats(participants[0])); // Reload chats for the first user
};

export default chatSlice.reducer;
