import {useEffect, useState} from 'react';
import appNavigate from '../../../hooks/useNavigationHook';
import appAuth from '../../../hooks/useAuth';
import {signInWithGoogle} from '../../../services/auth';
import {showToast} from '../../../components/Toast';
import { setUser } from '../../../store/slices/user.slice';
import { useAppDispatch } from '../../../store/store';

const initialState = {
  email: '',
  password: '',
};

const useAppSign = () => {
  const [signInData, setSignInData] = useState(initialState);
  const {handleLogin, observeAuth} = appAuth();
  const [loading, setLoading] = useState<boolean>(false);
  const [googleLoader, setGoogleLoader] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const {navigation} = appNavigate();
  const dispatch = useAppDispatch();

  useEffect(() => {
    const unsubscribe = observeAuth();
    return unsubscribe;
  }, [observeAuth]);

  const handleInputChange = (field: string, value: string) => {
    setSignInData(prevState => ({
      ...prevState,
      [field]: value,
    }));
  };

  const handleSignIn = async () => {
    setLoading(true);
    try {
      if (!signInData.email || !signInData.password) {
        return showToast(
          'Fill all Fields',
          'Please fill in all fields',
          'error',
        );
      }
      const userCredential = await handleLogin(
        signInData.email,
        signInData.password,
      );
      if (userCredential) {
        setSignInData(initialState);
      }
    } catch {
      showToast('Unknown Error', error || 'An unknown error occurred', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setGoogleLoader(true);
    try {
      const user = await signInWithGoogle();
      if (user) {
        dispatch(setUser(user));
      }
    } catch (googleError) {
      console.error('Failed to sign in with Google:', googleError);
    } finally {
      setGoogleLoader(false);
    }
  };

  return {
    handleInputChange,
    handleSignIn,
    loading,
    signInData,
    navigation,
    googleLoader,
    error,
    setError,
    handleGoogleSignIn,
  };
};

export default useAppSign;
