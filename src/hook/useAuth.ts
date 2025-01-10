import {useEffect, useState} from 'react';
import {FirebaseAuthTypes} from '@react-native-firebase/auth';
import {
  login,
  logoutUser as logout,
  signUp,
  observeAuthState,
} from './../services/authService';
import {UseAuthReturn} from '../types/auth';

const useAuth = (): UseAuthReturn => {
  const [user, setUser] = useState<FirebaseAuthTypes.User | null>(null);
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
      setUser(userCredential.user);
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
      setUser(userCredential.user);
      return userCredential;
    } catch (err: any) {
      setError(mapFirebaseError(err.code));
      console.error('Sign-Up Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async (): Promise<void> => {
    setLoading(true);

    try {
      await logout();
      setUser(null);
    } catch (err: any) {
      setError(err.message || 'An error occurred');
      console.error('Logout Error:', err);
    } finally {
      setLoading(false);
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
    loading,
    error,
    observeAuth: () => () => {},
    handleLogin,
    handleSignUp,
    handleLogout,
  };
};

export default useAuth;
