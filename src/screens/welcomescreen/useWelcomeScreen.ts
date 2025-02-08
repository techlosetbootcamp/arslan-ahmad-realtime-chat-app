import { useState } from 'react';
import useNavigate from '../../hooks/useNavigationHook';
import { signInWithGoogle } from '../../services/auth';


const useWelcomeScreen = () => {
    const [googleLoader, setGoogleLoader] = useState(false);
    const {navigation} = useNavigate();
    
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
    return {navigation, handleGoogleSignIn, googleLoader};
}
export default useWelcomeScreen;