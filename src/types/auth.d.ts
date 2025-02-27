import {FirebaseAuthTypes} from '@react-native-firebase/auth';
import {User} from './firestoreService';

export type UseAuthReturn = {
  user: User | null;
  loading: boolean;
  error: string | null;
  handleLogin: (
    email: string,
    password: string,
  ) => Promise<FirebaseAuthTypes.UserCredential | void>;
  handleSignUp: (
    email: string,
    password: string,
    name: string,
  ) => Promise<FirebaseAuthTypes.UserCredential | void>;
};

export type GoogleUser = {
  user: {
    id: string;
    name: string;
    email: string;
    photo: string | null;
    familyName?: string;
    givenName?: string;
  };
};
