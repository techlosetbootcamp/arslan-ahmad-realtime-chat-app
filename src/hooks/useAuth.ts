import {useAppDispatch, useAppSelector} from './../store/store';
import {useEffect, useState} from 'react';
import {FirebaseAuthTypes} from '@react-native-firebase/auth';
import {login, signUp, observeAuthState} from '../services/auth';
import {UseAuthReturn} from '../types/auth';
import {setLoading, setUser, UserState} from '../store/slices/user';
import useNavigate from './useNavigation';

const appAuth = (): UseAuthReturn => {
  const user = useAppSelector(state => state.user);
  const [error, setError] = useState<string | null>(null);
  const dispatch = useAppDispatch();
  const {navigation} = useNavigate();
  const loading = user.isLoading;

  useEffect(() => {
    const unsubscribe = observeAuthState(currentUser => {
      if (currentUser)
        dispatch(setUser(currentUser as Partial<UserState> & {uid: string}));
    });
    return () => unsubscribe();
  }, []);

  const handleLogin = async (
    email: string,
    password: string,
  ): Promise<FirebaseAuthTypes.UserCredential | void> => {
    try {
      const userCredential = await login(email, password);
      const firebaseUser = userCredential.user;

      if (firebaseUser) {
        const userData: Partial<UserState> & {uid: string} = {
          uid: firebaseUser.uid,
          displayName: firebaseUser.displayName || null,
          email: firebaseUser.email || null,
          photoURL: firebaseUser.photoURL || null,
          status: null,
          chats: [],
          contacts: [],
        };

        dispatch(setUser(userData));
        navigation.navigate('MainTabs');
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
        const userData = {
          uid: firebaseUser.uid,
          displayName: name,
          email: firebaseUser.email || '',
          status: null,
          photoURL: firebaseUser.photoURL || null,
        };

        dispatch(setUser(userData));
        navigation.navigate('MainTabs');
      }

      return userCredential;
    } catch (err: any) {
      setError(mapFirebaseError(err.code));
      console.error('Sign-Up Error:', err);
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
    handleLogin,
    handleSignUp,
    error,
    loading,
    observeAuth: () => () => {},
  };
};

export default appAuth;
