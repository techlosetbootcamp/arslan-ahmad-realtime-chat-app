import {useState} from 'react';
import useNavigate from '../../hooks/useNavigationHook';
import {signInWithGoogle} from '../../services/auth';
import {setUser} from '../../store/slices/user.slice';
import {useAppDispatch} from '../../store/store';

const useWelcomeScreen = () => {
  const [googleLoader, setGoogleLoader] = useState(false);
  const {navigation} = useNavigate();
  const dispatch = useAppDispatch();

  const handleGoogleSignIn = async () => {
    setGoogleLoader(true);
    try {
      const user = await signInWithGoogle();
      if (user) {
        dispatch(setUser(user));
      }
    } catch (error) {
      console.error('Failed to sign in with Google:', error);
    } finally {
      setGoogleLoader(false);
    }
  };
  return {navigation, handleGoogleSignIn, googleLoader};
};
export default useWelcomeScreen;
