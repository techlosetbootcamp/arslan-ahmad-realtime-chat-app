import {Action, configureStore, ThunkAction} from '@reduxjs/toolkit';
import userReducer from './slices/user';
import chatReducer from './slices/chats';
import contactsReducer from './slices/contacts';
import usersReducer from './slices/users';
import {useDispatch, useSelector, TypedUseSelectorHook} from 'react-redux';

export const store = configureStore({
  reducer: {
    user: userReducer,
    chat: chatReducer,
    contacts: contactsReducer,
    users: usersReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppThunk = ThunkAction<void, RootState, unknown, Action<string>>;

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
