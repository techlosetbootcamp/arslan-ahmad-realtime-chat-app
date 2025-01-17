import { Action, configureStore, ThunkAction } from '@reduxjs/toolkit';
import userReducer from './slices/userSlice';
import chatReducer from './slices/chatSlice';
import contactReducer from './slices/contactSlice';

export const store = configureStore({
  reducer: {
    user: userReducer,
    chat: chatReducer,
    contact: contactReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppThunk = ThunkAction<void, RootState, unknown, Action<string>>;