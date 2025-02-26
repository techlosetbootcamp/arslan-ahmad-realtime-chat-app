import {User} from '../firestoreService';

export type UsersState = {
  users: User[];
  isLoading: boolean;
  error: string | null;
};
