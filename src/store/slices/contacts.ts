import {createSlice, createAsyncThunk, PayloadAction} from '@reduxjs/toolkit';
import {
  fetchContacts,
  addContact as addContactToDB,
} from '../../services/firebase';
import {User} from '../../types/firestoreService';

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
  async (userId: string, {rejectWithValue}) => {
    try {
      const contacts = await fetchContacts(userId);
      return contacts;
    } catch (error) {
      return rejectWithValue('Error fetching contacts');
    }
  },
);

export const addContactThunk = createAsyncThunk(
  'contacts/addContact',
  async (
    {userId, contactId}: {userId: string; contactId: string},
    {rejectWithValue},
  ) => {
    try {
      await addContactToDB(userId, contactId);
      return contactId;
    } catch (error) {
      return rejectWithValue('Error adding contact');
    }
  },
);

const contactsSlice = createSlice({
  name: 'contacts',
  initialState,
  reducers: {},
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

    builder.addCase(addContactThunk.pending, state => {
      state.loading = true;
    });
    builder.addCase(
      addContactThunk.fulfilled,
      (state, action: PayloadAction<string>) => {
        state.loading = false;

        const contact = {uid: action.payload};
        state.contacts.push(contact as User);
      },
    );
    builder.addCase(addContactThunk.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });
  },
});

export const {} = contactsSlice.actions;

export default contactsSlice.reducer;
