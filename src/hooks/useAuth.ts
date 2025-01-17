import {useEffect, useState} from 'react';
import {FirebaseAuthTypes} from '@react-native-firebase/auth';
import {
  login,
  logoutUser as logout,
  signUp,
  observeAuthState,
  logoutUser,
} from '../services/auth';
import {UseAuthReturn} from '../types/auth';
import {User} from '../types/firestoreService';
import {Alert} from 'react-native';

const useAuth = (): UseAuthReturn => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = observeAuthState(currentUser => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, []);

  const handleLogin = async (
    email: string,
    password: string,
  ): Promise<FirebaseAuthTypes.UserCredential | void> => {
    setLoading(true);
    setError(null);

    try {
      const userCredential = await login(email, password);
      const firebaseUser = userCredential.user;

      if (firebaseUser) {
        const userData: User = {
          uid: firebaseUser.uid,
          displayName: firebaseUser.displayName || '',
          email: firebaseUser.email || '',
          photoURL: firebaseUser.photoURL || null,
          status: null,
          createdAt: null,
        };

        setUser(userData);
      }

      return userCredential;
    } catch (err: any) {
      setError(mapFirebaseError(err.code));
      console.error('Login Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (
    email: string,
    password: string,
    name: string,
  ): Promise<FirebaseAuthTypes.UserCredential | void> => {
    setLoading(true);
    setError(null);

    try {
      const userCredential = await signUp(email, password, name);

      const firebaseUser = userCredential.user;

      if (firebaseUser) {
        const userData: User = {
          uid: firebaseUser.uid,
          displayName: name,
          email: firebaseUser.email || '',
          status: null,
          photoURL: firebaseUser.photoURL || null,
          createdAt: null,
        };

        setUser(userData);
      }

      return userCredential;
    } catch (err: any) {
      setError(mapFirebaseError(err.code));
      console.error('Sign-Up Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logoutUser();
    } catch (error) {
      console.error('Failed to log out:', error);
      Alert.alert('Error', 'Failed to log out');
    }
  };

  const mapFirebaseError = (code: string): string => {
    switch (code) {
      case 'auth/user-not-found':
        return 'User not found';
      case 'auth/wrong-password':
        return 'Wrong password';
      case 'auth/invalid-email':
        return 'Invalid email';
      case 'auth/invalid-credential':
        return 'Invalid email or password';
      default:
        return 'An error occurred';
    }
  };

  return {
    user,
    handleLogin,
    handleSignUp,
    loading,
    error,
    observeAuth: () => () => {},
    handleLogout,
  };
};

export default useAuth;
