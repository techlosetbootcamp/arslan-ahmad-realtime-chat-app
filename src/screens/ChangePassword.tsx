import React, {useState} from 'react';
import {View, TextInput, Button, Alert, StyleSheet, Text} from 'react-native';
import auth from '@react-native-firebase/auth';
import useNavigate from '../hooks/useNavigation';
import InputField from '../components/InputField';
import ContentViewer from '../components/ContentViewer';
import ActionButton from '../components/ActionButton';
import {color} from '../constants/colors';
import {FirebaseError} from '@firebase/util';

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
      Alert.alert('Error', 'All fields are required.');
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert('Error', 'Passwords & Confirm Password are different.');
      return;
    }
    if (!user) {
      Alert.alert('Error', 'No authenticated user found.');
      return;
    }

    try {
      if (!user.email) {
        Alert.alert('Error', 'No email found for the user.');
        return;
      }
      const credential = auth.EmailAuthProvider.credential(
        user.email,
        currentPassword, // User-provided current password
      );
      await user.reauthenticateWithCredential(credential);

      await user.updatePassword(newPassword);

      Alert.alert('Success', 'Password updated successfully!', [
        {
          text: 'OK',
          onPress: () => navigation.navigate('Profile'),
        },
      ]);
    } catch (error) {
      if (error instanceof FirebaseError) {
        if (error.code === 'auth/wrong-password') {
          Alert.alert('Error', 'The current password is incorrect.');
        } else {
          Alert.alert(
            'Error',
            'Failed to update the password. Please try again.',
          );
        }
      } else {
        Alert.alert('Error', 'An unexpected error occurred.');
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
          color={color.main}
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
