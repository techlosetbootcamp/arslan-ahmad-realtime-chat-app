import {useState} from 'react';
import auth, {FirebaseAuthTypes} from '@react-native-firebase/auth';
import {showToast} from '../../components/Toast';

const useAppForgetPassword = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  const handlePasswordReset = async () => {
    if (!email) {
      showToast('Email is missing', 'Please enter your email address.', 'error');
      return;
    }

    try {
      await auth().sendPasswordResetEmail(email);
      showToast(
        'Success',
        'A password reset link has been sent to your email address.',
        'success',
      );
    } catch (err) {
      if (
        (err as FirebaseAuthTypes.NativeFirebaseAuthError).code ===
        'auth/user-not-found'
      ) {
        showToast('Email Not Found', 'No user found with this email address.', 'error');
      } else if (
        (err as FirebaseAuthTypes.NativeFirebaseAuthError).code ===
        'auth/invalid-email'
      ) {
        showToast('Invalid Email', 'The email address is not valid.', 'error');
      } else {
        showToast(
          'Not reset, Try again',
          'Something went wrong. Please try again later.',
          'error',
        );
      }
    }
  };
  return {email, setEmail, error, setError, handlePasswordReset};
};

export default useAppForgetPassword;
