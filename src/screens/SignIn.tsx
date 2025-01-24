import React from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import IconButton from '../components/IconButton';
import RulerText from '../components/RulerText';
import InputField from '../components/InputField';
import {ScrollView} from 'react-native-gesture-handler';
import ActionButton from '../components/ActionButton';
import {color} from '../constants/colors';
import AuthHeaderSection from '../components/AuthHeaderSection';
import useSign from '../hooks/useSign';

const SignIn: React.FC = () => {
  const {
    signInData,
    handleInputChange,
    handleSignIn,
    loading,
    navigation,
    signInWithGoogle,
  } = useSign();

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'android' ? 'padding' : undefined}
      style={{flex: 1, flexDirection: 'column', padding: 20}}>
      <ScrollView
        contentContainerStyle={{flex: 1, maxWidth: 400, margin: 'auto'}}>
        <View style={{flex: 3}}>
          <AuthHeaderSection title="Log in to Chatbox">
            Welcome back! Sign in using your social account or email to continue
            with us
          </AuthHeaderSection>
        </View>

        <View style={{flex: 6}}>
          <IconButton
            src={require('../assets/icons/google_icon.png')}
            onPress={signInWithGoogle}
          />
          <View style={styles.gapVertical}>
            <RulerText lineColor="#797C7B">OR</RulerText>
          </View>

          <View style={{gap: 25}}>
            <InputField
              val={signInData.email}
              setVal={value => handleInputChange('email', value)}
              title="Enter Email"
              type="email-address"
              placeholder="i.e. Jhon@gmail.com"
            />

            <InputField
              val={signInData.password}
              setVal={value => handleInputChange('password', value)}
              title="Password"
              type="default"
              secureTextEntry={true}
              placeholder="Enter your password"
            />
          </View>
        </View>

        <View style={{flex: 2, rowGap: 10}}>
          <ActionButton
            onClick={handleSignIn}
            loader={loading}
            onLoadText="Signing in...">
            Sign in with email
          </ActionButton>

          <TouchableOpacity
            activeOpacity={0.9}
            onPress={() => navigation.navigate('ForgetPassword')}>
            <Text
              style={{
                textAlign: 'center',
                marginTop: 15,
                color: color.blue,
                fontWeight: 600,
              }}>
              Forgot password?
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default SignIn;

const styles = StyleSheet.create({
  ghostIcon: {
    paddingVertical: 5,
    width: 40,
    height: 40,
    borderRadius: '50%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: color.ghost,
    alignSelf: 'center',
  },
  gapVertical: {marginTop: 10},
});
