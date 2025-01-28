import React, {useState} from 'react';
import {Alert, StyleSheet, View} from 'react-native';
import InputField from '../components/InputField';
import AuthHeaderSection from '../components/AuthHeaderSection';
import ActionButton from '../components/ActionButton';
import auth, {FirebaseAuthTypes} from '@react-native-firebase/auth';

const ForgetPassword = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  const handlePasswordReset = async () => {
    if (!email) {
      Alert.alert('Error', 'Please enter your email address.');
      return;
    }

    try {
      await auth().sendPasswordResetEmail(email);
      Alert.alert(
        'Success',
        'A password reset link has been sent to your email address.',
      );
    } catch (error) {
      if (
        (error as FirebaseAuthTypes.NativeFirebaseAuthError).code ===
        'auth/user-not-found'
      ) {
        Alert.alert('Error', 'No user found with this email address.');
      } else if (
        (error as FirebaseAuthTypes.NativeFirebaseAuthError).code ===
        'auth/invalid-email'
      ) {
        Alert.alert('Error', 'The email address is not valid.');
      } else {
        Alert.alert('Error', 'Something went wrong. Please try again later.');
      }
    }
  };
  return (
    <>
      <View style={ForgetPasswordScreen.header}>
        <AuthHeaderSection
          title="Forget Password"
          subText="Forgot your password? Don’t worry, we’ll send you a magic link right
          at your inbox!"
          styleSubTitle={{width: '80%'}}
        />
      </View>
      <View style={ForgetPasswordScreen.formBody}>
        <View style={ForgetPasswordScreen.formBody_Content}>
          <InputField
            title="Email"
            placeholder="Enter your email"
            type="email-address"
            val={email}
            setVal={(value: string) => setEmail(value)}
            setError={(err: string) => setError(err)}
          />
          <ActionButton
            onLoadText="Sending email..."
            error={error}
            onClick={handlePasswordReset}>
            Send Magic Link
          </ActionButton>
        </View>
      </View>
    </>
  );
};

export default ForgetPassword;

const ForgetPasswordScreen = StyleSheet.create({
  header: {flex: 3, justifyContent: 'flex-end', alignItems: 'flex-start'},
  formBody: {
    flex: 5,
    width: '100%',
    paddingHorizontal: 20,
    paddingVertical: 60,
  },
  formBody_Content: {
    width: '90%',
    margin: 'auto',
    height: '100%',
    justifyContent: 'space-between',
  },
});
