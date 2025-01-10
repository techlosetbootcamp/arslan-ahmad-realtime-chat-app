import {FirebaseAuthTypes} from '@react-native-firebase/auth';

export interface UseAuthReturn {
  user: FirebaseAuthTypes.User | null;
  loading: boolean;
  error: string | null;
  observeAuth: () => () => void;
  handleLogin: (
    email: string,
    password: string,
  ) => Promise<FirebaseAuthTypes.UserCredential | void>;
  handleSignUp: (
    email: string,
    password: string,
    name: string,
  ) => Promise<FirebaseAuthTypes.UserCredential | void>;
  handleLogout: () => Promise<void>;
}

export interface SignInResult {
  data: {
    idToken: string | null;
    scopes: string[];
    serverAuthCode: string | null;
    user: {
      email: string;
      familyName: string | null;
      givenName: string | null;
      id: string;
      name: string;
      photo: string | null;
    };
  };
  type: string;
}
