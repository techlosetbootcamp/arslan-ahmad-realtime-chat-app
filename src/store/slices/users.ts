import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User } from '../../types/firestoreService';
import { RootState } from '../store';
import { fetchUsers, searchUserInFirebase } from '../../services/firebase'; // Add a Firebase service for searching

const initialState: { users: User[]; isLoading: boolean; hasMore: boolean; lastFetchedAt?: string } = {
  users: [],
  isLoading: false,
  hasMore: true,
  lastFetchedAt: undefined,
};

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    setUsers(state, action: PayloadAction<{ users: User[]; hasMore: boolean }>) {
      state.users = action.payload.users;
      state.hasMore = action.payload.hasMore;
      state.isLoading = false;
    },
    addUsers(
      state: { users: User[]; hasMore: boolean; isLoading: boolean },
      action: { payload: { users: User[]; hasMore: boolean } }
    ) {
      state.users = [...state.users, ...action.payload.users];
      state.hasMore = action.payload.hasMore;
      state.isLoading = false;
    },
    setLoading(state: { isLoading: boolean }, action: { payload: boolean }) {
      state.isLoading = action.payload;
    },
    clearUsers(state) {
      state.users = [];
      state.hasMore = true;
    },
    updateLastFetchedAt(state, action: PayloadAction<string>) {
      state.lastFetchedAt = action.payload;
    },
  },
});

export const { setUsers, clearUsers, setLoading, addUsers, updateLastFetchedAt } = usersSlice.actions;

export default usersSlice.reducer;

export const fetchAndSetUsers = createAsyncThunk<
  void,
  { userId: string; reset?: boolean },
  { state: RootState }
>('users/fetchAndSetUsers', async ({ userId, reset }, { dispatch, getState }) => {
  try {
    const state = getState();
    if (state.users.isLoading) return;

    dispatch(setLoading(true));

    const { users, hasMore } = await fetchUsers(userId);
    console.log('fetched users (slices/user.tsx) =>', users);

    if (reset) {
      dispatch(setUsers({ users, hasMore }));
    } else {
      dispatch(addUsers({ users, hasMore }));
    }

    const lastFetchedAt = new Date().toISOString();
    dispatch(updateLastFetchedAt(lastFetchedAt));
  } catch (error) {
    console.error('Error fetching users:', error);
    dispatch(setLoading(false));
  }
});

export const searchForUser = createAsyncThunk<
  User[],
  { searchText: string; excludeUserId: string },
  { state: RootState }
>('users/searchForUser', async ({ searchText, excludeUserId }) => {
  try {
    const users = await searchUserInFirebase(searchText, excludeUserId);
    return users;
  } catch (error) {
    console.error('Error searching for user:', error);
    return [];
  }
});
