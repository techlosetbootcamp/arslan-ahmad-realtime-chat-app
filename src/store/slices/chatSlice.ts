import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Message {
  id: string;
  senderId: string;
  text: string;
  timestamp: string; 
}

export interface Chat {
  id: string;
  members: string[]; 
  lastMessage: string; 
  lastMessageTimestamp: string; 
  messages: Message[];
}

export interface ChatState {
  chats: Record<string, Chat>;
}

const initialState: ChatState = {
  chats: {}, 
};

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    
    setChats(state, action: PayloadAction<Record<string, Chat>>) {
      state.chats = action.payload;
    },

    
    addOrUpdateChat(state, action: PayloadAction<Chat>) {
      const chat = action.payload;
      state.chats[chat.id] = chat;
    },

    
    addMessage(state, action: PayloadAction<{ chatId: string; message: Message }>) {
      const { chatId, message } = action.payload;

      if (state.chats[chatId]) {
        state.chats[chatId].messages.push(message);
        state.chats[chatId].lastMessage = message.text;
        state.chats[chatId].lastMessageTimestamp = message.timestamp;
      }
    },

    
    updateLastMessage(
      state,
      action: PayloadAction<{ chatId: string; lastMessage: string; lastMessageTimestamp: string }>
    ) {
      const { chatId, lastMessage, lastMessageTimestamp } = action.payload;

      if (state.chats[chatId]) {
        state.chats[chatId].lastMessage = lastMessage;
        state.chats[chatId].lastMessageTimestamp = lastMessageTimestamp;
      }
    },
  },
});

export const { setChats, addOrUpdateChat, addMessage, updateLastMessage } = chatSlice.actions;
export default chatSlice.reducer;
