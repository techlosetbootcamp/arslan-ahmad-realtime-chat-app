import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { FirebaseAuthTypes } from '@react-native-firebase/auth';

interface UserState {
  uid: string | null;
  name: string | null;
  email: string | null;
  avatar: string | null;
}

const initialState: UserState = {
  uid: null,
  name: null,
  email: null,
  avatar: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<FirebaseAuthTypes.User | null>) {
      if (action.payload) {
        state.uid = action.payload.uid;
        state.name = action.payload.displayName || null;
        state.email = action.payload.email || null;
        state.avatar = action.payload.photoURL || null;
      } else {
        state.uid = null;
        state.name = null;
        state.email = null;
        state.avatar = null;
      }
    },
    clearUser(state) {
      state.uid = null;
      state.name = null;
      state.email = null;
      state.avatar = null;
    },
  },
});

export const { setUser, clearUser } = userSlice.actions;
export default userSlice.reducer;
