import React, {useState} from 'react';
import {View, TextInput, Button, Alert, StyleSheet, Text} from 'react-native';
import auth from '@react-native-firebase/auth';
import useNavigate from '../hooks/useNavigation';

const ForgotPasswordScreen = () => {
  const [email, setEmail] = useState('');
  const {navigation} = useNavigate();

  const handlePasswordReset = async () => {
    if (!email) {
      Alert.alert('Error', 'Please enter your email address');
      return;
    }

    try {
      await auth().sendPasswordResetEmail(email);
      Alert.alert('Success', 'Password reset email sent! Check your inbox.', [
        {
          text: 'OK',
          onPress: () => navigation.navigate('SignIn'),
        },
      ]);
    } catch (error) {
      console.error(error);
      Alert.alert('[Error while forgetPassword]: Something went wrong.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Reset Password</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter your email"
        keyboardType="email-address"
        value={email}
        onChangeText={text => setEmail(text)}
      />
      <Button title="Send Reset Email" onPress={handlePasswordReset} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f9f9f9',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    height: 50,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 20,
    backgroundColor: '#fff',
  },
});

export default ForgotPasswordScreen;
