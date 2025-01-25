import {useEffect, useState} from 'react';
import appNavigate from './useNavigation';
import appAuth from './useAuth';
import {Alert} from 'react-native';
import {signInWithGoogle} from '../services/auth';

const initialState = {
  email: '',
  password: '',
};

const appSign = () => {
  const [signInData, setSignInData] = useState(initialState);
  const {handleLogin, loading, observeAuth} = appAuth();
  const [error, setError] = useState<string>('');
  const {navigation} = appNavigate();

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
    try {
      if (!signInData.email || !signInData.password) {
        return Alert.alert('Error', 'Please fill in all fields');
      }
      const userCredential = await handleLogin(
        signInData.email,
        signInData.password,
      );
      if (userCredential) {
        Alert.alert('Success', 'You are successfully logged in!');
        setSignInData(initialState);
      }
    } catch {
      Alert.alert('Error', error || 'An unknown error occurred');
    }
  };

  return {
    handleInputChange,
    handleSignIn,
    loading,
    signInData,
    navigation,
    signInWithGoogle,
    error,
    setError,
  };
};

export default appSign;
