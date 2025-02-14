import {useState} from 'react';
import useAuth from '../../../hooks/useAuth';
import {showToast} from '../../../components/Toast';
import useNavigate from '../../../hooks/useNavigationHook';

const initialState = {
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
};

const useSignup = () => {
  const {navigation} = useNavigate();
  const [userData, setUserData] = useState(initialState);
  const [error, setError] = useState<string>('');
  const {handleSignUp} = useAuth();
  const [loading, setLoading] = useState(false);

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
      setLoading(true);
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
    } finally {
      setLoading(false);
    }
  };

  return {userData, handleInputChange, SignUphandler, loading, error, setError};
};

export default useSignup;
