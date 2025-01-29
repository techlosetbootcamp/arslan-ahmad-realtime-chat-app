import React, {useState} from 'react';
import {View, TextInput, Button, Alert, StyleSheet, Text} from 'react-native';
import auth from '@react-native-firebase/auth';
import useNavigate from '../hooks/useNavigation';
import InputField from '../components/InputField';
import ContentViewer from '../components/ContentViewer';
import ActionButton from '../components/ActionButton';
import {color} from '../constants/colors';
import {FirebaseError} from '@firebase/util';
import {showToast} from '../components/Toast';

const initialState = {
  currentPassword: '',
  newPassword: '',
  confirmPassword: '',
};

const ForgotPasswordScreen = () => {
  const [passwords, setPasswords] = useState(initialState);
  const {navigation} = useNavigate();
  const user = auth().currentUser;

  const handlePasswordReset = async () => {
    const {currentPassword, newPassword, confirmPassword} = passwords;

    if (!currentPassword || !newPassword || !confirmPassword) {
      showToast('Error', 'All fields are required.', 'error');
      return;
    }

    if (newPassword !== confirmPassword) {
      showToast(
        'Error',
        'Passwords & Confirm Password are different.',
        'error',
      );
      return;
    }
    if (!user) {
      showToast('Error', 'No authenticated user found.', 'error');
      return;
    }

    try {
      if (!user.email) {
        showToast('Error', 'No email found for the user.', 'error');
        return;
      }
      const credential = auth.EmailAuthProvider.credential(
        user.email,
        currentPassword,
      );
      await user.reauthenticateWithCredential(credential);

      await user.updatePassword(newPassword);

      showToast('Success', 'Password updated successfully!', 'success');
      navigation.goBack();
    } catch (error) {
      if (error instanceof FirebaseError) {
        if (error.code === 'auth/wrong-password') {
          showToast('Error', 'The current password is incorrect.', 'error');
        } else {
          showToast(
            'Error',
            'Failed to update the password. Please try again.',
            'error',
          );
        }
      } else {
        showToast('Error', 'An unexpected error occurred.', 'error');
      }
    }
  };

  return (
    <ContentViewer title="Reset Password">
      <View style={styles.container}>
        <InputField
          title="Current Password"
          placeholder="Enter current password"
          val={passwords.currentPassword}
          setVal={val => setPasswords({...passwords, currentPassword: val})}
          secureTextEntry={true}
        />
        <InputField
          title="New Password"
          placeholder="Enter new password"
          val={passwords.newPassword}
          setVal={val => setPasswords({...passwords, newPassword: val})}
          secureTextEntry={true}
        />
        <InputField
          title="Confirm new Password"
          placeholder="confirm new password"
          val={passwords.confirmPassword}
          setVal={val => setPasswords({...passwords, confirmPassword: val})}
          secureTextEntry={true}
        />
      </View>
      <View>
        <ActionButton
          color={color.primary}
          onLoadText="Resetting Password..."
          onClick={handlePasswordReset}>
          Reset Password
        </ActionButton>
      </View>
    </ContentViewer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 50,
    gap: 30,
  },
});

export default ForgotPasswordScreen;
