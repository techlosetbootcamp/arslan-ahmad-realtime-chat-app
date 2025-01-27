import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { addContact as addContactToDB } from '../../services/firebase';
import { User } from '../../types/firestoreService';
import { RootState, useAppSelector } from '../store';

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

export const addContactThunk = createAsyncThunk(
  'contacts/addContact',
  async (
    { userId, contactId }: { userId: string; contactId: string },
    { getState, rejectWithValue }
  ) => {
    try {
      await addContactToDB(userId, contactId);

      const state = getState() as RootState;
      const user = state.users.users.find(user => user.uid === contactId);

      if (!user) {
        throw new Error('User not found in local state.');
      }

      return user;
    } catch (error) {
      return rejectWithValue('Error adding contact');
    }
  }
);

const contactsSlice = createSlice({
  name: 'contacts',
  initialState,
  reducers: {
    addContact: (state, action: PayloadAction<string>) => {
      const contactId = action.payload;
      const users = useAppSelector(state => state.users.users);
      const contact = users.find(user => user.uid === contactId);
      if (contact) {
        state.contacts.push(contact);
      }
    },
  },
  extraReducers: builder => {
    builder.addCase(addContactThunk.pending, state => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(
      addContactThunk.fulfilled,
      (state, action: PayloadAction<User>) => {
        state.loading = false;

        const alreadyExists = state.contacts.some(
          contact => contact.uid === action.payload.uid
        );
        if (!alreadyExists) {
          state.contacts.push(action.payload);
        }
      }
    );
    builder.addCase(addContactThunk.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });
  },
});

export default contactsSlice.reducer;
