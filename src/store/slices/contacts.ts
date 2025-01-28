import {createSlice, createAsyncThunk, PayloadAction} from '@reduxjs/toolkit';
import {User} from '../../types/firestoreService';
import {RootState} from '../store';

interface ContactsState {
  contacts: User[];
  loading: boolean;
  error: string | null;
}

const initialState: ContactsState = {
  contacts: [],
  loading: false,
  error: null,
};

export const fetchContactsThunk = createAsyncThunk(
  'contacts/fetchContacts',
  async (userId: string, {getState, rejectWithValue}) => {
    try {
      const state = getState() as RootState;
      const allUsers = state.users.users;
      const currentUser = state.user;
      const userContacts = currentUser.contacts;

      const filteredContacts = allUsers.filter(
        user => user && user.uid && userContacts.includes(user.uid),
      );
      return filteredContacts;
    } catch (error) {
      return rejectWithValue('Failed to filter contacts');
    }
  },
);

export const addContact = createAsyncThunk<
  User | undefined,
  string,
  {state: RootState}
>('contacts/addContact', async (uid, {getState, rejectWithValue}) => {
  const allUsers = getState().users.users;

  const userToAdd = allUsers.find(user => user.uid === uid);

  if (!userToAdd) {
    console.error('User not found in users slice:', uid);
    return rejectWithValue('User not found');
  }

  return userToAdd;
});

const contactsSlice = createSlice({
  name: 'contacts',
  initialState,
  reducers: {
    setContactsLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
  },
  extraReducers: builder => {
    builder.addCase(addContact.fulfilled, (state, action) => {
      if (action.payload) {
        const isAlreadyContact = state.contacts.some(
          contact => contact.uid === action.payload?.uid,
        );

        if (!isAlreadyContact) {
          state.contacts.push(action.payload);
        } else {
          console.warn('User is already in contacts:', action.payload);
        }
      }
    });
    builder.addCase(fetchContactsThunk.pending, state => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(
      fetchContactsThunk.fulfilled,
      (state, action: PayloadAction<User[]>) => {
        state.loading = false;
        state.contacts = action.payload;
      },
    );
    builder.addCase(fetchContactsThunk.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });
  },
});

export const {setContactsLoading} = contactsSlice.actions;

export default contactsSlice.reducer;
