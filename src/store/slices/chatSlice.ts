import firestore from '@react-native-firebase/firestore';
import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {AppThunk} from '../store';
import {
  createNewChat as createChat,
  fetchChats,
  createNewChat,
} from '../../services/firebase';
import {Chat, Message} from '../../types/firestoreService';

interface ChatState {
  chats: Record<string, Chat>;
  messages: Record<string, Message[]>;
  isLoading: boolean;
}

const initialState: ChatState = {
  chats: {},
  messages: {},
  isLoading: false,
};

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    setChats(state, action: PayloadAction<Record<string, Chat>>) {
      const chats = action.payload;
      state.chats = Object.entries(chats).reduce((acc: any, [chatId, chat]) => {
        acc[chatId] = {
          ...chat,
          lastActive: chat.lastActive
            ? new Date(chat.lastActive).toISOString()
            : null,
          // participantsDetails,
        };
        return acc;
      }, {});
    },
    setMessages(
      state,
      action: PayloadAction<{chatId: string; messages: Message[]}>,
    ) {
      state.messages[action.payload.chatId] = action.payload.messages.map(
        message => ({
          ...message,
          timestamp: message.timestamp
            ? new Date(message.timestamp).toISOString()
            : null,
        }),
      );
    },
    addMessage(
      state,
      action: PayloadAction<{chatId: string; message: Message}>,
    ) {
      const {chatId, message} = action.payload;
      state.messages[chatId] = [
        ...(state.messages[chatId] || []),
        {
          ...message,
          timestamp: message.timestamp
            ? new Date(message.timestamp).toISOString()
            : null,
        },
      ];
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.isLoading = action.payload;
    },
  },
});

export const fetchUserChats =
  (userId: string): AppThunk =>
  async dispatch => {
    dispatch(setLoading(true));
    const chats = await fetchChats(userId);
    const chatMap = chats.reduce((acc, chat) => {
      acc[chat.id] = chat;
      return acc;
    }, {} as Record<string, Chat>);
    dispatch(setChats(chatMap));
    dispatch(setLoading(false));
  };

export const startChat =
  (userId: string, contactId: string): AppThunk =>
  async dispatch => {
    dispatch(setLoading(true));

    const chats = await fetchChats(userId);
    const existingChat = chats.find(chat =>
      chat.participants.includes(contactId),
    );
    let chatId = existingChat?.id;

    if (!chatId) {
      chatId = await createNewChat([userId, contactId]);
    }

    dispatch(fetchUserChats(userId));
    dispatch(setLoading(false));

    return chatId;
  };

export const {setChats, setMessages, addMessage, setLoading} =
  chatSlice.actions;
export default chatSlice.reducer;
