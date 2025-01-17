import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AppThunk } from '../store';
import { createUser, fetchUser } from '../../services/firebase';
import { User } from '../../types/firestoreService';

export interface UserState {
  uid: string | null;
  displayName: string | null;
  email: string | null;
  photoURL?: string | null;
  description: string | null;
  status: string | null;
  contacts: string[];
  chats: string[];
  isLoading: boolean;
}

const initialState: UserState = {
  uid: null,
  displayName: null,
  email: null,
  photoURL: null,
  description: null,
  status: null,
  contacts: [],
  chats: [],
  isLoading: false,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser(
      state,
      action: PayloadAction<Partial<UserState> & { uid: string }>
    ) {
      Object.assign(state, action.payload);
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.isLoading = action.payload;
    },
    clearUser(state) {
      Object.assign(state, initialState);
    },
  },
});

export const { setUser, setLoading, clearUser } = userSlice.actions;

// Thunk to fetch user data from Firestore
export const fetchUserData = (uid: string): AppThunk => async dispatch => {
  dispatch(setLoading(true));
  const userData = await fetchUser(uid);

  if (userData) {
    dispatch(
      setUser({
        uid,
        displayName: userData.displayName || null,
        email: userData.email || null,
        photoURL: userData.photoURL || null,
        description: userData.description || null,
        status: userData.status || null,
        contacts: userData.contacts || [],
        chats: userData.chats || [],
      })
    );
  }

  dispatch(setLoading(false));
};

export const createUserProfile = (
  uid: string,
  userData: Partial<UserState>
): AppThunk => async dispatch => {
  const userPayload: Partial<User> = {
    ...userData,
    uid: userData.uid !== null ? userData.uid : uid, // Ensure `uid` is valid
  };

  await createUser(uid, userPayload);
  dispatch(fetchUserData(uid));
};


export default userSlice.reducer;
