import {User} from '../firestoreService';

export type ContactsState = {
  contacts: User[];
  loading: boolean;
  error: string | null;
};
