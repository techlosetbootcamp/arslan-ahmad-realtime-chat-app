import {Action, configureStore, ThunkAction} from '@reduxjs/toolkit';
import userReducer from './slices/user.slice';
import chatReducer from './slices/chats.slice';
import contactsReducer from './slices/contacts.slice';
import usersReducer from './slices/users.slice';
import {useDispatch, useSelector, TypedUseSelectorHook} from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {persistStore, persistReducer} from 'redux-persist';

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
};

persistReducer(persistConfig, userReducer);

export const store = configureStore({
  reducer: {
    user: userReducer,
    chat: chatReducer,
    contacts: contactsReducer,
    users: usersReducer,
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppThunk = ThunkAction<void, RootState, unknown, Action<string>>;

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
