import {useEffect, useState} from 'react';
import useAuth from '../../../hooks/useAuth';
import {showToast} from '../../../components/Toast';
import useNavigate from '../../../hooks/useNavigationHook';
import { signInWithGoogle } from '../../../services/auth';

const initialState = {
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
};

const appSignup = () => {
  const {navigation} = useNavigate();
  const [userData, setUserData] = useState(initialState);
  const [error, setError] = useState<string>('');
  const {handleSignUp, observeAuth} = useAuth();
  const [googleLoader, setGoogleLoader] = useState(false);
  const [loading, setLoading] = useState(false);

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
        return showToast('Error', 'Please fill in all fields', 'error');
      }
      const userCredential = await handleSignUp(
        userData.email,
        userData.password,
        userData.name,
      );
      if (userCredential) {
        showToast('Success', 'You are successfully logged in!', 'success');
        setUserData(initialState);
        navigation.navigate('MainTabs');
      }
    } catch {
      showToast('Error', error || 'An unknown error occurred', 'error');
    }
  };


  const handleGoogleSignIn = () => {
    setGoogleLoader(true);
    try {
      signInWithGoogle();
    } catch (error) {
      console.error('Failed to sign in with Google:', error);
    } finally {
      setGoogleLoader(false);
    }
  };

  return {userData, handleInputChange, SignUphandler, loading, error, setError, googleLoader, handleGoogleSignIn};
};

export default appSignup;
