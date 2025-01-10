import {useEffect} from 'react';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import Config from 'react-native-config';

export const useGoogleSignIn = () => {
  useEffect(() => {
    GoogleSignin.configure({
      webClientId: Config.GOOGLE_AUTHENTICATE_CLIENTID
    });
  }, []);
};
