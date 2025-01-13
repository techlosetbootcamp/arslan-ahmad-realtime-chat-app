import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Contact {
  uid: string;
  displayName: string;
  email: string;
  photoURL: string | null;
}

interface ContactState {
  contacts: Contact[];
}

const initialState: ContactState = {
  contacts: [],
};

const contactSlice = createSlice({
  name: 'contact',
  initialState,
  reducers: {
    setContacts(state, action: PayloadAction<Contact[]>) {
      state.contacts = action.payload;
    },
  },
});

export const { setContacts } = contactSlice.actions;
export default contactSlice.reducer;
