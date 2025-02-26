import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {AppThunk} from '../store';
import {createUser, fetchUser} from '../../services/user';
import {User} from '../../types/firestoreService';
import { Chat, Participant, UserState } from '../../types/slices/user';


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

export const fetchUserData =
  (uid: string): AppThunk =>
  async dispatch => {
    dispatch(setLoading(true));
    const userData = await fetchUser(uid);

    if (userData) {
      dispatch(
        setUser({
          uid,
          displayName: userData?.displayName || null,
          email: userData?.email || null,
          photoURL: userData?.photoURL || null,
          description: userData?.description || null,
          status: userData?.status || null,
          contacts: userData?.contacts || [],
          chats:
            userData?.chats?.map((chat: Chat) => ({
              ...chat,
              participantsDetails: chat.participantsDetails?.map(
                (participant: Participant) => ({
                  ...participant,
                  createdAt: participant?.createdAt?.toMillis() || null,
                }),
              ),
            })) || [],
        }),
      );
    }

    dispatch(setLoading(false));
  };

export const createUserProfile =
  (uid: string, userData: Partial<UserState>): AppThunk =>
  async dispatch => {
    const userPayload: Partial<User> = {
      ...userData,
      uid: userData.uid !== null ? userData?.uid : uid,
    };

    await createUser(uid, userPayload);
    dispatch(fetchUserData(uid));
  };

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<Partial<UserState> & {uid: string}>) {
      Object.assign(state, action.payload);
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.isLoading = action.payload;
    },
    addUserToContact(state, action: PayloadAction<string>) {
      if (!state.contacts) {
        state.contacts = [];
      }

      const alreadyExists = state?.contacts?.some(
        contactId => contactId === action.payload,
      );
      if (!alreadyExists && action.payload) {
        state.contacts.push(action.payload);
      }
    },
    clearUser(state) {
      Object.assign(state, initialState);
    },
  },
});

export const {setUser, setLoading, clearUser, addUserToContact} = userSlice.actions;

export default userSlice.reducer;
