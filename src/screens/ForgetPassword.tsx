import React, {useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import InputField from '../components/InputField';

const ForgetPassword = () => {
  const [email, setEmail] = useState('');
  return (
    <View style={styles.container}>
      <Text>ForgetPassword</Text>
      <InputField
        title="Enter your email address"
        placeholder="Email"
        type="email-address"
        val={email}
        setVal={value => setEmail(value)}
      />
    </View>
  );
};

export default ForgetPassword;

const styles = StyleSheet.create({
  container: {flex: 1, justifyContent: 'center', alignItems: 'center'},
});
