import {useEffect, useState} from 'react';
import useAuth from '../../../hooks/useAuth';
import {showToast} from '../../../components/Toast';
import useNavigate from '../../../hooks/useNavigationHook';
import {signInWithGoogle} from '../../../services/auth';
import {setUser} from '../../../store/slices/user.slice';
import {useAppDispatch} from '../../../store/store';

const initialState = {
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
};

const useAppSignup = () => {
  const {navigation} = useNavigate();
  const [userData, setUserData] = useState(initialState);
  const [error, setError] = useState<string>('');
  const {handleSignUp, observeAuth} = useAuth();
  const [googleLoader, setGoogleLoader] = useState(false);
  const [loading, setLoading] = useState(false);
  const dispatch = useAppDispatch();

  useEffect(() => {
    const unsubscribe = observeAuth();
    return unsubscribe;
  }, [observeAuth]);

  const handleInputChange = (field: string, value: string) => {
    setUserData(prevState => ({
      ...prevState,
      [field]: value,
    }));
  };

  const SignUphandler = async () => {
    try {
      if (!userData.email || !userData.password || !userData.name) {
        return showToast(
          'Needs to fill data',
          'Please fill in all fields',
          'error',
        );
      }
      const userCredential = await handleSignUp(
        userData.email,
        userData.password,
        userData.name,
      );
      if (userCredential) {
        setLoading(true);
        setUserData(initialState);
        navigation.navigate('MainTabs');
        setLoading(true);
      }
    } catch {
      showToast('Unknown Error', error || 'An unknown error occurred', 'error');
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
    userData,
    handleInputChange,
    SignUphandler,
    loading,
    error,
    setError,
    googleLoader,
    handleGoogleSignIn,
  };
};

export default useAppSignup;
