import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { FirebaseAuthTypes } from '@react-native-firebase/auth';

interface UserState {
  uid: string | null;
  displayName: string | null;
  email: string | null;
  photoURL: string | null;
  isLoading: boolean;
}

const initialState: UserState = {
  uid: null,
  displayName: null,
  email: null,
  photoURL: null,
  isLoading: true,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<{
      uid: string;
      displayName: string | null;
      email: string | null;
      photoURL: string | null;
    }>) {
      const { uid, displayName, email, photoURL } = action.payload;
      state.uid = uid;
      state.displayName = displayName;
      state.email = email;
      state.photoURL = photoURL;
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.isLoading = action.payload;
    },
    clearUser(state) {
      state.uid = null;
      state.displayName = null;
      state.email = null;
      state.photoURL = null;
    },
  },
});

export const { setUser, clearUser, setLoading } = userSlice.actions;
export default userSlice.reducer;
