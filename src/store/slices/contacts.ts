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

      const filteredContacts = allUsers.filter(user => {
        if (user?.uid) {
          userContacts.includes(user.uid);
        }
      });
      console.log('Filtered contacts (slice) =>', filteredContacts);
      return filteredContacts;
    } catch (error) {
      return rejectWithValue('Failed to filter contacts');
    }
  },
);

const contactsSlice = createSlice({
  name: 'contacts',
  initialState,
  reducers: {
    addContact: (state, action: PayloadAction<User>) => {
      const alreadyExists = state.contacts.some(
        contact => contact.uid === action.payload.uid,
      );
      if (!alreadyExists) {
        state.contacts.push(action.payload);
      }
    },
    setContactsLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
  },
  extraReducers: builder => {
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

export const {addContact, setContactsLoading} = contactsSlice.actions;

export default contactsSlice.reducer;
