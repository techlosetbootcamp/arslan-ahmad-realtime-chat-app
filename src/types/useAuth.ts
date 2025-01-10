import { FirebaseAuthTypes } from "@react-native-firebase/auth";

export interface UseAuthReturn {
    user: FirebaseAuthTypes.User | null;
    loading: boolean;
    error: string | null;
    handleLogin: (email: string, password: string) => Promise<FirebaseAuthTypes.UserCredential | void>;
    handleSignUp: (email: string, password: string, name: string) => Promise<FirebaseAuthTypes.UserCredential | void>;
    handleLogout: () => Promise<void>;
  }
  