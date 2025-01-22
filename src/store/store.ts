import { Action, configureStore, ThunkAction } from '@reduxjs/toolkit';
import userReducer from './slices/userSlice';
import chatReducer from './slices/chatSlice';
import contactsReducer from './slices/contactsSlice';

export const store = configureStore({
  reducer: {
    user: userReducer,
    chat: chatReducer,
    contacts: contactsReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['chat/setMessages'],  
        ignoredPaths: ['chat.chats.*.lastActive', 'chat.chats.*.participantsDetails.*.createdAt'], 
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppThunk = ThunkAction<void, RootState, unknown, Action<string>>;

// export useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
// export useAppDispatch = () => useDispatch<AppDispatch>();